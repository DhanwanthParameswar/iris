import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AnalyzeEnv {
	GEMINI_API_KEY: string;
}

interface RequestBody {
	audioUrl: string;
	resumeUrl?: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

export async function handleAnalyze(
	request: Request,
	env: AnalyzeEnv,
	corsHeaders: Record<string, string>,
): Promise<Response> {
	const { audioUrl, resumeUrl } = (await request.json()) as RequestBody;

	if (!audioUrl) {
		return new Response("Missing audioUrl", {
			status: 400,
			headers: corsHeaders,
		});
	}

	if (!env.GEMINI_API_KEY) {
		return Response.json(
			{ error: "GEMINI_API_KEY is not configured" },
			{ status: 500, headers: corsHeaders },
		);
	}

	const audioRes = await fetch(audioUrl);
	const audioBuffer = await audioRes.arrayBuffer();
	const audioBase64 = arrayBufferToBase64(audioBuffer);

	let resumeBase64: string | null = null;
	if (resumeUrl) {
		const resumeRes = await fetch(resumeUrl);
		const resumeBuffer = await resumeRes.arrayBuffer();
		resumeBase64 = arrayBufferToBase64(resumeBuffer);
	}

	const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
	const model = genAI.getGenerativeModel({
		model: "gemini-flash-latest",
		generationConfig: { responseMimeType: "application/json" },
	});

	const systemPrompt = `
        You are an expert career coach analyzing an interview/recruiter session.
        
        Task:
        1. Listen to the audio and read the attached resume.
        2. Transcribe the conversation (Speaker labels are ONLY: 'Interviewer' and 'Candidate').
        3. Analyze the candidate's performance.
        4. Determine the overall sentiment from this list ONLY: ["Confident", "Hesitant", "Enthusiastic", "Anxious", "Neutral"].
        
        Output JSON Schema (Strict):
        {
          "title": "A very short, a couple words max, specific title for the session.",
          "transcript": [
            { "role": "Interviewer", "text": "..." },
            { "role": "Candidate", "text": "..." }
          ],
          "analysis": {
            "sentiment": "One of the allowed words",
            "summary": "2-3 sentence overview of performance.",
            "coachingTips": ["Specific tip 1", "Specific tip 2", "Specific tip 3"],
            "followUp": "Actionable advice on what to do next + a draft message if applicable."
          }
        }
      `;

	const parts: Array<
		| { text: string }
		| { inlineData: { mimeType: string; data: string } }
	> = [
		{ text: systemPrompt },
		{
			inlineData: {
				mimeType: "audio/mp3",
				data: audioBase64,
			},
		},
	];

	if (resumeBase64) {
		parts.push({
			inlineData: {
				mimeType: "application/pdf",
				data: resumeBase64,
			},
		});
	}

	const result = await model.generateContent(parts);
	const responseText = result.response.text();

	return new Response(responseText, {
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	});
}

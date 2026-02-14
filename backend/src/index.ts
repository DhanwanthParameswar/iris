import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Env {
	GEMINI_API_KEY: string;
}

interface RequestBody {
	audioUrl: string;
	resumeUrl?: string; // We now take the URL, not the text
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
		}

		try {
			const { audioUrl, resumeUrl } = (await request.json()) as RequestBody;

			if (!audioUrl) {
				return new Response('Missing audioUrl', { status: 400, headers: corsHeaders });
			}

			// 1. Fetch the Audio File
			console.log('Fetching audio...', audioUrl);
			const audioRes = await fetch(audioUrl);
			const audioBuffer = await audioRes.arrayBuffer();
			const audioBase64 = arrayBufferToBase64(audioBuffer);

			// 2. Fetch the Resume PDF (if provided)
			let resumeBase64 = null;
			if (resumeUrl) {
				console.log('Fetching resume...', resumeUrl);
				const resumeRes = await fetch(resumeUrl);
				const resumeBuffer = await resumeRes.arrayBuffer();
				resumeBase64 = arrayBufferToBase64(resumeBuffer);
			}

			// 3. Initialize Gemini
			const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
			const model = genAI.getGenerativeModel({
				model: 'gemini-flash-latest',
				generationConfig: { responseMimeType: 'application/json' },
			});

			// 4. Construct the Prompt with Sentiment Logic
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

			// 5. Build the "Parts" Array
			const parts: any[] = [
				{ text: systemPrompt },
				{
					inlineData: {
						mimeType: 'audio/mp3', // Gemini is flexible with audio mime types
						data: audioBase64,
					},
				},
			];

			// Add Resume Part if it exists
			if (resumeBase64) {
				parts.push({
					inlineData: {
						mimeType: 'application/pdf',
						data: resumeBase64,
					},
				});
			}

			// 6. Execute
			const result = await model.generateContent(parts);
			const responseText = result.response.text();

			return new Response(responseText, {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		} catch (error: any) {
			console.error('Error:', error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
	},
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

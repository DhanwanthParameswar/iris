export interface Env {
	ELEVENLABS_API_KEY: string;
	GEMINI_API_KEY: string;
  }
  
  /**
   * Main fetch handler for the Cloudflare Worker.
   * This is the single endpoint your frontend will call.
   */
  export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  
	  // CORS headers
	  const corsHeaders = {
		"Access-Control-Allow-Origin": "*", // Lock to your domain in production
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	  };
  
	  // Handle OPTIONS (CORS preflight)
	  if (request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	  }
  
	  // Only accept POST
	  if (request.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
		  status: 405, 
		  headers: { ...corsHeaders, "Content-Type": "application/json" } 
		});
	  }
  
	  try {
		// 1. Get the audio file from the frontend
		const formData = await request.formData();
		const audioFile = formData.get("audio"); // Must match frontend key
  
		if (!audioFile || !(audioFile instanceof Blob)) {
		  return new Response(JSON.stringify({ error: "No audio file found" }), { 
			status: 400, 
			headers: { ...corsHeaders, "Content-Type": "application/json" } 
		  });
		}
  
		// 2. Transcribe audio with ElevenLabs (speaker diarization)
		const transcriptData = await getTranscript(audioFile, env);
  
		// 3. Process the diarized transcript into speaker turns
		let formattedTranscript = "";
  
		if (transcriptData.words && Array.isArray(transcriptData.words)) {
		  let lastSpeaker: string | null = null;
		  let currentBuffer: string[] = [];
  
		  // Optional mapping to nicer speaker labels
		  const labelMap: Record<string, string> = {
			speaker_0: "Speaker A",
			speaker_1: "Speaker B"
		  };
  
		  for (const token of transcriptData.words) {
			const speaker = token.speaker_id;
			const text = token.text;
  
			if (speaker !== lastSpeaker) {
			  if (currentBuffer.length > 0) {
				formattedTranscript += `${labelMap[lastSpeaker!] || lastSpeaker}:\n${currentBuffer.join("")}\n\n`;
			  }
			  currentBuffer = [];
			  lastSpeaker = speaker;
			}
  
			currentBuffer.push(text);
		  }
  
		  // Flush final block
		  if (currentBuffer.length > 0) {
			formattedTranscript += `${labelMap[lastSpeaker!] || lastSpeaker}:\n${currentBuffer.join("")}\n\n`;
		  }
  
		} else if (transcriptData.text) {
		  // Fallback if diarization failed
		  formattedTranscript = transcriptData.text;
		} else {
		  throw new Error("Could not parse transcript data: missing words[]");
		}
  
		// 4. Send formatted transcript to Gemini for analysis
		const analysis = await getAnalysis(formattedTranscript, env);
  
		// 5. Return final JSON
		const finalResponse = {
		  transcript: formattedTranscript,
		  analysis: analysis,
		  rawTranscriptData: transcriptData
		};
  
		return new Response(JSON.stringify(finalResponse), {
		  headers: {
			...corsHeaders,
			"Content-Type": "application/json",
		  },
		});
  
	  } catch (error) {
		console.error("Error in main handler:", error);
		const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
		return new Response(JSON.stringify({ error: errorMessage }), {
		  status: 500,
		  headers: {
			...corsHeaders,
			"Content-Type": "application/json",
		  },
		});
	  }
	},
  };
  
  /**
   * Transcribes audio using the ElevenLabs Speech-to-Text API.
   * This version is configured for speaker diarization.
   */
  async function getTranscript(audioBlob: Blob, env: Env): Promise<any> {
	console.log("Sending audio to ElevenLabs for diarization...");
	const apiKey = env.ELEVENLABS_API_KEY;
  
	const formData = new FormData();
	formData.append("file", audioBlob, "audio.wav");
	formData.append("model_id", "scribe_v1"); // STT model
	formData.append("diarize", "true");
	formData.append("num_speakers", "2");
  
	const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
	  method: "POST",
	  headers: {
		"Xi-Api-Key": apiKey,
	  },
	  body: formData,
	});
  
	if (!response.ok) {
	  const errorText = await response.text();
	  console.error("ElevenLabs API Error:", errorText);
	  throw new Error(`Failed to transcribe audio: ${errorText}`);
	}
  
	const transcriptData: any = await response.json();
	if (!transcriptData) {
	  throw new Error("Invalid response format from ElevenLabs");
	}
  
	console.log("Got diarized transcript data.");
	return transcriptData;
  }
  
  /**
   * Analyzes a transcript using the Google Gemini API.
   */
  async function getAnalysis(transcript: string, env: Env): Promise<any> {
	console.log("Sending transcript to Gemini...");
	const apiKey = env.GEMINI_API_KEY;
  
	const systemPrompt = `You are a world-class career coach. A student just had a conversation with a recruiter. Here is the transcript: "${transcript}".
  Analyze this transcript and return ONLY a valid JSON object (no other text, no markdown wrappers like \`\`\`json) with the following keys: "summary", "sentiment", "email_draft", "coaching_tip".
  - summary: A brief 2-sentence summary of the conversation.
  - sentiment: One word: "Positive", "Neutral", or "Negative".
  - email_draft: A professional follow-up email draft based on the conversation.
  - coaching_tip: One actionable tip for the student for next time.`;
  
	const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
  
	const body = {
	  contents: [{ parts: [{ text: systemPrompt }] }],
	  safetySettings: [
		{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
	  ],
	  generationConfig: {
		responseMimeType: "application/json",
	  }
	};
  
	const response = await fetch(apiUrl, {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify(body),
	});
  
	if (!response.ok) {
	  const errorText = await response.text();
	  console.error("Gemini API Error:", errorText);
	  throw new Error(`Failed to get analysis: ${errorText}`);
	}
  
	const data: any = await response.json();
	const jsonResponseText = data.candidates[0].content.parts[0].text;
  
	console.log("Got analysis.");
	return JSON.parse(jsonResponseText);
  }  
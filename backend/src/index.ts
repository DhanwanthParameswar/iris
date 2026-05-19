import { handleAnalyze } from "./analyze";
import { corsHeaders, handleOptions } from "./cors";
import { handleFirebaseToken } from "./firebase-token";
import type { Env } from "./env";

export default {
	async fetch(
		request: Request,
		env: Env,
		_ctx: ExecutionContext,
	): Promise<Response> {
		if (request.method === "OPTIONS") {
			return handleOptions();
		}

		const url = new URL(request.url);
		const path = url.pathname.replace(/\/+$/, "") || "/";

		if (path.endsWith("/firebase-token")) {
			if (request.method !== "POST") {
				return new Response("Method Not Allowed", {
					status: 405,
					headers: corsHeaders,
				});
			}

			const response = await handleFirebaseToken(request, env);
			return new Response(response.body, {
				status: response.status,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			});
		}

		if (request.method !== "POST") {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: corsHeaders,
			});
		}

		try {
			const response = await handleAnalyze(request, env, corsHeaders);
			return response;
		} catch (error: unknown) {
			console.error("Error:", error);
			const message =
				error instanceof Error ? error.message : "Internal Server Error";
			return Response.json(
				{ error: message },
				{ status: 500, headers: corsHeaders },
			);
		}
	},
};

import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";

export interface FirebaseTokenEnv {
	AUTH0_DOMAIN: string;
	AUTH0_AUDIENCE: string;
	FIREBASE_SERVICE_ACCOUNT: string;
}

interface ServiceAccount {
	client_email: string;
	private_key: string;
}

const FIREBASE_AUDIENCE =
	"https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

function normalizeAuth0Domain(domain: string): string {
	return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function parseServiceAccount(json: string): ServiceAccount {
	const parsed = JSON.parse(json) as ServiceAccount;
	if (!parsed.client_email || !parsed.private_key) {
		throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT JSON");
	}
	return parsed;
}

async function verifyAuth0AccessToken(
	token: string,
	env: FirebaseTokenEnv,
): Promise<string> {
	const domain = normalizeAuth0Domain(env.AUTH0_DOMAIN);
	const issuer = `https://${domain}/`;
	const jwks = createRemoteJWKSet(
		new URL(`https://${domain}/.well-known/jwks.json`),
	);

	const { payload } = await jwtVerify(token, jwks, {
		issuer,
		audience: env.AUTH0_AUDIENCE,
	});

	if (!payload.sub || typeof payload.sub !== "string") {
		throw new Error("Auth0 token missing sub claim");
	}

	return payload.sub;
}

async function createFirebaseCustomToken(
	uid: string,
	serviceAccount: ServiceAccount,
): Promise<string> {
	const privateKey = await importPKCS8(
		serviceAccount.private_key.replace(/\\n/g, "\n"),
		"RS256",
	);

	const now = Math.floor(Date.now() / 1000);

	return new SignJWT({ uid })
		.setProtectedHeader({ alg: "RS256", typ: "JWT" })
		.setIssuer(serviceAccount.client_email)
		.setSubject(serviceAccount.client_email)
		.setAudience(FIREBASE_AUDIENCE)
		.setIssuedAt(now)
		.setExpirationTime(now + 3600)
		.sign(privateKey);
}

export async function handleFirebaseToken(
	request: Request,
	env: FirebaseTokenEnv,
): Promise<Response> {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return Response.json(
			{ error: "Missing Authorization bearer token" },
			{ status: 401 },
		);
	}

	const accessToken = authHeader.slice("Bearer ".length).trim();
	if (!accessToken) {
		return Response.json({ error: "Empty bearer token" }, { status: 401 });
	}

	if (!env.AUTH0_DOMAIN || !env.AUTH0_AUDIENCE || !env.FIREBASE_SERVICE_ACCOUNT) {
		return Response.json(
			{ error: "Auth endpoint is not configured on the server" },
			{ status: 500 },
		);
	}

	try {
		const uid = await verifyAuth0AccessToken(accessToken, env);
		const serviceAccount = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT);
		const token = await createFirebaseCustomToken(uid, serviceAccount);

		return Response.json({ token });
	} catch (error) {
		console.error("Firebase token error:", error);
		return Response.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to mint Firebase token",
			},
			{ status: 401 },
		);
	}
}

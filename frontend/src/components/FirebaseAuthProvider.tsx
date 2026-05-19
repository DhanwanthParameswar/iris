import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { onAuthStateChanged, signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { apiUrl } from "../lib/api";

export const FirebaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user?.sub) {
      setError(null);
      signOut(auth).finally(() => setFirebaseReady(true));
      return;
    }

    let cancelled = false;
    let syncing = false;
    setFirebaseReady(false);
    setError(null);

    const syncFirebaseAuth = async () => {
      if (syncing) return;
      syncing = true;
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(apiUrl("/firebase-token"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error || "Failed to connect to Firebase");
        }

        const { token } = (await response.json()) as { token: string };
        if (cancelled) return;

        await signInWithCustomToken(auth, token);
      } catch (err) {
        if (cancelled) return;
        console.error("Firebase auth sync failed:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not sign in to Firebase. Try logging out and back in.",
        );
        setFirebaseReady(true);
      } finally {
        syncing = false;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (cancelled) return;

      if (firebaseUser?.uid === user.sub) {
        setFirebaseReady(true);
        setError(null);
        return;
      }

      void syncFirebaseAuth();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAuthenticated, isLoading, user?.sub, getAccessTokenSilently]);

  if (isLoading || (isAuthenticated && !firebaseReady && !error)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f9fafb] text-gray-600">
        Connecting...
      </div>
    );
  }

  if (error && isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f9fafb] p-6 text-center">
        <p className="text-red-600">{error}</p>
        <p className="max-w-md text-sm text-gray-600">
          Ensure the Worker has AUTH0_DOMAIN, AUTH0_AUDIENCE, and
          FIREBASE_SERVICE_ACCOUNT secrets, then redeploy.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const RequireOnboarding = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading: authLoading } = useAuth0();
  const [onboardingStatus, setOnboardingStatus] = useState<{
    isLoading: boolean;
    isOnboarded: boolean;
  }>({
    isLoading: true,
    isOnboarded: false,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.sub) {
        setOnboardingStatus({ isLoading: false, isOnboarded: false });
        return;
      }

      // Check localStorage first
      const cacheKey = `onboarding_${user.sub}`;
      const cachedStatus = localStorage.getItem(cacheKey);

      if (cachedStatus !== null) {
        // Use cached status
        const isOnboarded = JSON.parse(cachedStatus);
        setOnboardingStatus({ isLoading: false, isOnboarded });
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.sub);
        const userDoc = await getDoc(userDocRef);

        let isOnboarded = false;
        if (userDoc.exists()) {
          const userData = userDoc.data();
          isOnboarded = userData.onboarded === true;
        }

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(isOnboarded));

        setOnboardingStatus({
          isLoading: false,
          isOnboarded,
        });
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, assume not onboarded to be safe
        setOnboardingStatus({ isLoading: false, isOnboarded: false });
      }
    };

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading]);

  if (authLoading || onboardingStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh]">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-[#1287FF] rounded-full"></div>
            <p className="text-slate-600 font-['Poppins'] text-sm">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!onboardingStatus.isOnboarded) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

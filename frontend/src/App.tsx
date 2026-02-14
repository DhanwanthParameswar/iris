import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
// Import your existing pages
import MainPage from "./pages/MainPage";
import DashboardPage from "./pages/DashboardPage"; // Will become "Dashboard"
import RecordPage from "./pages/RecordPage"; // Will become "Record"
import SessionPage from "./pages/SessionPage"; // Will become "Session View"
import ProfilePage from "./pages/ProfilePage"; // New onboarding page

// Import our new Guards
import { RequireAuth } from "./components/RequireAuth";
import { RequireOnboarding } from "./components/RequireOnboarding";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTE: The Landing Page */}
      <Route path="/" element={<MainPage />} />

      {/* PROTECTED ROUTES: The Actual App */}

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      {/* 1. The Dashboard (Library) */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireOnboarding>
              <DashboardPage />
            </RequireOnboarding>
          </RequireAuth>
        }
      />

      {/* 2. The Recorder */}
      <Route
        path="/record"
        element={
          <RequireAuth>
            <RequireOnboarding>
              <RecordPage />
            </RequireOnboarding>
          </RequireAuth>
        }
      />

      {/* 3. The Session Viewer (Analysis + Transcript) */}
      {/* We use :id so we can load specific sessions later */}
      <Route
        path="/session/:id"
        element={
          <RequireAuth>
            <RequireOnboarding>
              <SessionPage />
            </RequireOnboarding>
          </RequireAuth>
        }
      />

      {/* Fallback: Redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

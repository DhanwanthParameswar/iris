import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import mascotUrl from "../assets/mascot.svg";

function MainPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      loginWithRedirect({
        appState: { targetUrl: "/dashboard" },
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col font-['Sora'] relative overflow-hidden">
      {/* Decorative background blob (Subtle polish) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* --- Navbar --- */}
      <nav className="w-full flex justify-center py-8 z-10">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          Iris
        </span>
      </nav>

      {/* --- Hero Section --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        <div className="flex flex-col items-center max-w-xl text-center gap-8">
          {/* Mascot Image */}
          <div className="relative group">
            {/* Glow effect behind mascot */}
            <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
            <img
              src={mascotUrl}
              alt="Iris Mascot"
              className="relative w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-xl transform transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Typography */}
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Meet Your New <span className="text-[#1287FF]">AI</span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1287FF] leading-tight">
              Career Fair Coach
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-slate-500 font-['Poppins'] text-sm md:text-base max-w-xs md:max-w-md leading-relaxed">
            Turn recruiter chats into job offers. Record, analyze, and get your
            follow-ups written for you.
          </p>

          {/* Call to Action */}
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-[#1287FF] hover:bg-[#0f6fd6] text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Start Recording
          </button>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

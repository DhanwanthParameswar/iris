import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Types for our data
interface AnalysisData {
  summary: string;
  followUp: string;
  coachingTips: string[];
  sentiment: string;
}

interface TranscriptLine {
  role: string;
  text: string;
}

const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the session ID from the URL

  // State
  const [activeTab, setActiveTab] = useState<"analysis" | "transcript">(
    "analysis",
  );
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [transcriptData, setTranscriptData] = useState<TranscriptLine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionTitle, setSessionTitle] = useState<string>("");

  // Inject Fonts (Sora & Poppins)
  useEffect(() => {
    const fontId = "sora-poppins-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400&family=Sora:wght@600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Fetch session data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }

      setIsLoading(true);

      try {
        const sessionDocRef = doc(db, "sessions", id);
        const sessionDoc = await getDoc(sessionDocRef);

        if (sessionDoc.exists()) {
          const data = sessionDoc.data();

          // Set analysis data
          if (data.analysis) {
            setAnalysisData({
              summary: data.analysis.summary || "",
              followUp: data.analysis.followUp || "",
              coachingTips: data.analysis.coachingTips || [],
              sentiment: data.analysis.sentiment || "Neutral",
            });
          }

          // Set transcript data
          if (data.transcript) {
            setTranscriptData(data.transcript);
          }

          // Set session title
          if (data.title) {
            setSessionTitle(data.title);
          }
        } else {
          alert("Session not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        alert("Failed to load session data");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh]">
        {/* --- HEADER --- */}
        <div className="w-full flex-none text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "Sora, sans-serif", fontWeight: 700 }}
          >
            {sessionTitle || `Session ${id ? `#${id.slice(0, 4)}` : "Detail"}`}
          </h1>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "analysis"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "transcript"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Transcript
            </button>
          </div>

          {/* Sentiment Badge */}
          {analysisData?.sentiment && (
            <div className="mb-4">
              <SentimentBadge sentiment={analysisData.sentiment} />
            </div>
          )}
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-auto px-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              {/* FIXED SPINNER */}
              <svg
                className="animate-spin h-10 w-10 text-[#1287FF]"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Track */}
                <circle
                  className="opacity-20"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                {/* Spinning Line */}
                <circle
                  className="opacity-90"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>

              <p className="text-gray-400 font-['Sora'] text-sm">
                Loading session data...
              </p>
            </div>
          ) : (
            <>
              {/* ANALYSIS TAB */}
              {activeTab === "analysis" && (
                <div className="space-y-6">
                  <Section title="Summary" content={analysisData?.summary} />
                  <Section title="Follow Up" content={analysisData?.followUp} />
                  <CoachingTips tips={analysisData?.coachingTips || []} />
                </div>
              )}

              {/* TRANSCRIPT TAB */}
              {activeTab === "transcript" && (
                <div className="space-y-3">
                  {transcriptData.length > 0 ? (
                    transcriptData.map((line, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          line.role === "Candidate"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            line.role === "Candidate"
                              ? "bg-[#1287FF] text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <p
                            className="text-xs font-semibold mb-1 opacity-70"
                            style={{ fontFamily: "Sora, sans-serif" }}
                          >
                            {line.role}
                          </p>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {line.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm text-center mt-8">
                      No transcript available.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="w-full flex-none">
          <div className="w-full h-px bg-gray-100 mt-4 mb-4"></div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-[#1287FF] rounded-2xl shadow-lg text-white text-[16px] font-['Sora'] font-semibold hover:bg-[#0f6fd6] hover:shadow-none transition-all w-full focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Exit to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Sentiment Badge
const SentimentBadge: React.FC<{ sentiment: string }> = ({ sentiment }) => {
  const sentimentConfig: Record<
    string,
    { color: string; bg: string; emoji: string }
  > = {
    Confident: { color: "text-green-700", bg: "bg-green-100", emoji: "💪" },
    Hesitant: { color: "text-yellow-700", bg: "bg-yellow-100", emoji: "🤔" },
    Enthusiastic: { color: "text-blue-700", bg: "bg-blue-100", emoji: "🎉" },
    Anxious: { color: "text-red-700", bg: "bg-red-100", emoji: "😰" },
    Neutral: { color: "text-gray-700", bg: "bg-gray-100", emoji: "😐" },
  };

  const config = sentimentConfig[sentiment] || sentimentConfig.Neutral;

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="text-sm text-gray-500 font-['Sora']"
        style={{ fontWeight: 600 }}
      >
        Sentiment:
      </span>
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        <span>{config.emoji}</span>
        <span>{sentiment}</span>
      </span>
    </div>
  );
};

// Helper component for Coaching Tips
const CoachingTips: React.FC<{ tips: string[] }> = ({ tips }) => (
  <div className="w-full">
    <h3
      className="text-sm mb-2 ml-1 text-gray-900"
      style={{ fontFamily: "Sora, sans-serif", fontWeight: 600 }}
    >
      Coaching Tips
    </h3>
    <div
      className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 text-gray-700 text-sm leading-relaxed"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {tips.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      ) : (
        "No coaching tips available."
      )}
    </div>
  </div>
);

// Helper component for Analysis sections to keep code clean
const Section: React.FC<{ title: string; content?: string }> = ({
  title,
  content,
}) => (
  <div className="w-full">
    <h3
      className="text-sm mb-2 ml-1 text-gray-900"
      style={{ fontFamily: "Sora, sans-serif", fontWeight: 600 }}
    >
      {title}
    </h3>
    <div
      className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 text-gray-700 text-sm leading-relaxed"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {content || "No data available."}
    </div>
  </div>
);

export default SessionPage;

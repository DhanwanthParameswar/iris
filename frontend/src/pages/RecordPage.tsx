import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// --- Types for our Processing Stages ---
type ProcessingStage =
  | "idle"
  | "uploading"
  | "analyzing"
  | "saving"
  | "complete";

export default function RecordPage() {
  const navigate = useNavigate();
  const { user } = useAuth0();

  // --- Logic State ---
  const [running, setRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // New State for Processing
  const [stage, setStage] = useState<ProcessingStage>("idle");

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // --- Font Injection (Styles for animation included here) ---
  useEffect(() => {
    const fontId = "sora-poppins-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Sora:wght@600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Reset audio chunks
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Update UI state
      setHasStarted(true);
      setRunning(true);
      startTimeRef.current = Date.now() - elapsedMs;
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedMs(Date.now() - startTimeRef.current);
        }
      }, 50);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop MediaRecorder if it exists
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      // Stop all tracks in the media stream
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const finalizeRecording = async () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    await new Promise<void>((resolve) => {
      const prevOnStop = recorder.onstop;
      recorder.onstop = () => {
        prevOnStop?.call(recorder, new Event("stop"));
        resolve();
      };
      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
    });
  };

  const toggleTimer = () => {
    if (running) stopTimer();
    else startTimer();
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedMs(0);
    setHasStarted(false);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --- The New Processing Logic ---
  const handleAnalyze = async () => {
    await finalizeRecording();

    if (!user?.sub) {
      alert("User not authenticated");
      return;
    }

    if (audioChunksRef.current.length === 0) {
      alert("No audio recorded. Please record some audio first.");
      return;
    }

    try {
      // 1. Create audio blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      // 2. Uploading to Firebase Storage
      setStage("uploading");
      const storageRef = ref(
        storage,
        `recordings/${user.sub}/${Date.now()}.webm`,
      );
      await uploadBytes(storageRef, audioBlob);
      const audioUrl = await getDownloadURL(storageRef);

      // 3. Analyzing (combined transcribing + analyzing)
      setStage("analyzing");

      // Fetch user's resume URL from Firestore
      const userDocRef = doc(db, "users", user.sub);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data();
      const resumeUrl = userData.resumeUrl;

      if (!resumeUrl) {
        throw new Error(
          "No resume found. Please upload a resume in your profile.",
        );
      }

      // Call backend API
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioUrl,
          resumeUrl,
        }),
      });

      if (!response.ok) {
        let errorMessage = `API request failed: ${response.statusText}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) {
            errorMessage = errorBody.message;
          }
        } catch {
          // ignore JSON parse errors
        }

        if (response.status === 503) {
          errorMessage =
            "The AI service is experiencing high demand. Please try again in a few minutes.";
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      // 4. Saving to Firestore
      setStage("saving");
      const sessionsRef = collection(db, "sessions");
      const newDocRef = await addDoc(sessionsRef, {
        userId: user.sub,
        createdAt: new Date(),
        title: result.title || "Untitled Session",
        transcript: result.transcript || "",
        analysis: result.analysis || "",
      });

      // 5. Done -> Navigate
      setStage("complete");
      setTimeout(() => {
        navigate(`/session/${newDocRef.id}`);
      }, 800);
    } catch (error) {
      console.error("Error processing recording:", error);
      alert(
        `Failed to process recording: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setStage("idle");
    }
  };

  return (
    <>
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop {
          animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh] relative overflow-hidden transition-all duration-300">
          {/* --- HEADER --- */}
          <div
            className={`flex justify-between items-center mb-8 z-10 transition-opacity duration-300 ${
              stage !== "idle" ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-['Sora'] font-semibold text-slate-900">
              New Session
            </span>
            <div className="w-10"></div>
          </div>

          {/* --- PROCESSING OVERLAY --- */}
          {stage !== "idle" && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-500">
              {/* KEY CHANGE: We add key={stage} here.
                  This forces React to destroy and recreate this div every time 'stage' changes.
                  This re-triggers the 'animate-pop' CSS animation.
              */}
              <div
                key={stage}
                className="flex flex-col items-center animate-pop"
              >
                {/* Animated Ring */}
                <div className="relative w-24 h-24 mb-8">
                  <svg
                    className="animate-spin w-full h-full text-blue-100 duration-[3s]"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#1287FF]">
                    {stage === "uploading" && <CloudIcon />}
                    {stage === "analyzing" && <SparklesIcon />}
                    {stage === "saving" && <DatabaseIcon />}
                    {stage === "complete" && <CheckIcon />}
                  </div>
                </div>

                {/* Status Text */}
                <h2 className="text-xl font-['Sora'] font-bold text-slate-800 mb-2">
                  {stage === "uploading" && "Uploading Audio..."}
                  {stage === "analyzing" && "Generating Insights..."}
                  {stage === "saving" && "Finalizing Session..."}
                  {stage === "complete" && "All Done!"}
                </h2>
                <p className="text-slate-400 font-['Poppins'] text-sm">
                  {stage === "complete"
                    ? "Redirecting you now..."
                    : "This usually takes a few seconds."}
                </p>
              </div>
            </div>
          )}

          {/* --- MAIN CONTENT (Existing UI) --- */}
          <div
            className={`flex-1 flex flex-col items-center justify-center space-y-12 z-10 transition-all duration-700 ${
              stage !== "idle" ? "scale-90 opacity-0 blur-sm" : "opacity-100"
            }`}
          >
            {/* Timer Display */}
            <div
              className={`text-center transition-all duration-500 ease-out ${
                hasStarted
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-40 transform translate-y-4"
              }`}
            >
              <h1 className="text-7xl font-['Sora'] font-bold text-slate-800 tracking-tight font-variant-numeric tabular-nums">
                {formatTime(elapsedMs)}
              </h1>
              <p className="text-slate-400 font-['Poppins'] mt-4 text-sm font-medium tracking-wide">
                {running
                  ? "LISTENING..."
                  : hasStarted
                    ? "PAUSED"
                    : "TAP MIC TO START"}
              </p>
            </div>

            {/* Mic Visualizer / Button */}
            <div className="relative group">
              {running && (
                <>
                  <div className="absolute inset-0 rounded-full bg-[#1287FF] animate-ping opacity-20 duration-1000"></div>
                  <div className="absolute inset-[-12px] rounded-full bg-[#1287FF] opacity-10 animate-pulse"></div>
                </>
              )}

              <button
                onClick={toggleTimer}
                className={`
                  relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl
                  ${
                    running
                      ? "bg-[#1287FF] text-white shadow-blue-200 scale-105"
                      : "bg-white border-[3px] border-slate-100 text-slate-400 hover:border-blue-100 hover:text-[#1287FF] hover:scale-105"
                  }
                `}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {running ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                    </>
                  ) : (
                    <>
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </>
                  )}
                </svg>
              </button>
            </div>

            {/* Action Controls */}
            <div
              className={`flex items-center gap-4 transition-all duration-500 ease-out ${
                hasStarted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none"
              }`}
            >
              <button
                onClick={resetTimer}
                className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent transition-all"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              <button
                onClick={handleAnalyze}
                className="px-8 py-4 rounded-2xl bg-[#1287FF] text-white font-['Sora'] font-semibold shadow-lg hover:bg-[#0f6fd6] transition-all flex items-center gap-3"
              >
                <span>Analyze Session</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Icons ---

function CloudIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
      <path d="M3 12A9 3 0 0 0 21 12"></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-500"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

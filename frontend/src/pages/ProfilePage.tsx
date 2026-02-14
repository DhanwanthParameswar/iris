import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { db, storage } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  // --- Determine Mode ---
  // If state.mode is 'edit', we are editing. Otherwise, we are onboarding.
  const [isEditMode, setIsEditMode] = useState(location.state?.mode === "edit");

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track initial state to disable "Save" if no changes were made
  const [initialFullName, setInitialFullName] = useState("");

  // --- Initialization ---
  useEffect(() => {
    // Inject Fonts
    const fontId = "sora-poppins-fonts";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Sora:wght@600;700&display=swap";
      document.head.appendChild(link);
    }

    // Fetch user data from Firebase
    const fetchUserData = async () => {
      if (!user?.sub) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.sub);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Document exists - treat as Edit Mode
          const userData = userDoc.data();
          setIsEditMode(true);
          setFullName(userData.fullName || "");
          setInitialFullName(userData.fullName || "");
          setExistingResumeUrl(userData.resumeUrl || null);
        } else {
          // Document does NOT exist - treat as Onboarding Mode
          setIsEditMode(false);
          // Leave name blank for onboarding
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // On error, default to onboarding mode with blank name
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // --- Handlers ---
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !user?.sub) return;

    try {
      setLoading(true);

      let resumeUrl = existingResumeUrl; // Keep existing URL by default

      // Upload new resume file if one was selected
      if (resumeFile) {
        const storageRef = ref(storage, `resumes/${user.sub}.pdf`);
        await uploadBytes(storageRef, resumeFile);
        resumeUrl = await getDownloadURL(storageRef);
      }

      // Save user data to Firestore
      const userDocRef = doc(db, "users", user.sub);
      await setDoc(
        userDocRef,
        {
          fullName,
          resumeUrl,
          email: user.email,
          onboarded: true,
        },
        { merge: true },
      );

      // Cache onboarding status for this user to avoid redirect loop
      localStorage.setItem(`onboarding_${user.sub}`, JSON.stringify(true));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Logic for Disabling Button ---
  const hasChanges = () => {
    if (!isEditMode) return true; // Always allow submission in onboarding (if valid)

    const nameChanged = fullName !== initialFullName;
    const fileChanged = resumeFile !== null; // If they picked a new file, that's a change

    return nameChanged || fileChanged;
  };

  const isFormValid =
    fullName.trim().length > 0 &&
    (isEditMode
      ? existingResumeUrl !== null || resumeFile !== null
      : resumeFile !== null);
  // Note: In edit mode, must have existing resume OR new file. In onboarding, must upload a new file.

  const canSubmit = isFormValid && hasChanges();

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh] relative overflow-hidden transition-all duration-300">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-[#1287FF] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-['Poppins'] text-sm">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh] relative overflow-hidden transition-all duration-300">
        {/* --- Header (Dynamic) --- */}
        <div className="flex items-center justify-between mb-8 z-10 relative">
          {isEditMode ? (
            // Edit Mode Header: With Back Button
            <>
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
              <div className="text-center flex-1 pr-8">
                <h1 className="text-xl font-['Sora'] font-bold text-slate-900">
                  Edit Profile
                </h1>
              </div>
            </>
          ) : (
            // Onboarding Mode Header: Centered Icon
            <div className="w-full text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#1287FF] mb-4">
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h1 className="text-2xl font-['Sora'] font-bold text-slate-900">
                Welcome to Iris
              </h1>
            </div>
          )}
        </div>

        {/* --- Subheader --- */}
        <div className="text-center mb-6 -mt-4">
          <p className="text-slate-500 font-['Poppins'] text-sm px-4">
            {isEditMode
              ? "Update your details to refine your interview coaching sessions."
              : "Let's get your profile set up so we can tailor your interview coaching."}
          </p>
        </div>

        {/* --- Form Content --- */}
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto px-1">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 font-['Sora'] ml-1">
              Full Name
            </label>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 mt-1.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#1287FF] transition-all shadow-sm">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(capitalizeWords(e.target.value))}
                placeholder="e.g. Alex Johnson"
                className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-['Poppins'] text-sm"
              />
            </div>
          </div>

          {/* Resume Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 font-['Sora'] ml-1">
              Resume (PDF)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 mt-1.5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group
                ${isDragging ? "border-[#1287FF] bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}
                ${resumeFile ? "bg-blue-50/50 border-blue-200" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              {resumeFile ? (
                // Selected New File
                <div className="text-center animate-fadeIn">
                  <div className="w-10 h-10 bg-green-100 text-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-900 font-['Poppins'] truncate max-w-[200px]">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Click to change</p>
                </div>
              ) : existingResumeUrl ? (
                // Has existing resume, no new file selected
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-900 font-['Poppins']">
                    Current Resume Saved
                  </p>
                  <a
                    href={existingResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-500 hover:text-blue-600 underline mt-1 inline-block"
                  >
                    View Resume
                  </a>
                  <p className="text-xs text-slate-400 mt-2 font-['Poppins']">
                    Click to upload a new one
                  </p>
                </div>
              ) : (
                // No New File Selected and no existing resume
                <div className="text-center">
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-700 font-['Poppins']">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-['Poppins']">
                    PDF (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Footer / Action Button --- */}
        <div className="mt-8 pt-6">
          <div className="w-full h-px bg-gray-100 mt-4 mb-4"></div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className={`
              w-full py-3 rounded-2xl font-['Sora'] font-semibold text-white shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-200
              ${
                !canSubmit || loading
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-[#1287FF] hover:bg-[#0f6fd6] hover:shadow-none"
              }
            `}
          >
            {loading
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Complete Setup"}
          </button>
        </div>
      </div>
    </div>
  );
}

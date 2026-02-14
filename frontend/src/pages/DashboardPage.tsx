import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Session type
interface Session {
  id: string;
  title: string;
  createdAt: any;
  sentiment: string;
}

function DashboardPage() {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [isLoadingName, setIsLoadingName] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  // Filter sessions based on search
  const filtered = sessions.filter((session) =>
    session.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  // Fetch user's sessions from Firebase
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const sessionsQuery = query(
          collection(db, "sessions"),
          where("userId", "==", user.sub),
          orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(sessionsQuery);
        const fetchedSessions: Session[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedSessions.push({
            id: doc.id,
            title: data.title || "Untitled Session",
            createdAt: data.createdAt,
            sentiment: data.analysis?.sentiment || "Neutral",
          });
        });

        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        // If you see a Firestore index error, check the console for a link to create the composite index
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  // Fetch user's first name from Firebase
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user?.sub) {
        setIsLoadingName(false);
        return;
      }

      setIsLoadingName(true);
      try {
        const userDocRef = doc(db, "users", user.sub);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const fullName = userData.fullName || "";
          // Extract first name (everything before the first space)
          const firstName = fullName.split(" ")[0] || "User";
          setUserFirstName(firstName);
        } else {
          setUserFirstName("User");
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserFirstName("User");
      } finally {
        setIsLoadingName(false);
      }
    };

    fetchUserName();
  }, [user]);

  // Delete session
  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      setSessions(sessions.filter((s) => s.id !== sessionId));
      if (selected === sessionId) {
        setSelected(null);
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    }
  };

  // Start editing session title
  const handleStartEdit = (
    sessionId: string,
    currentTitle: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setEditingId(sessionId);
    setEditingTitle(currentTitle);
  };

  // Save edited title
  const handleSaveTitle = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!editingTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    try {
      await updateDoc(doc(db, "sessions", sessionId), {
        title: editingTitle.trim(),
      });
      setSessions(
        sessions.map((s) =>
          s.id === sessionId ? { ...s, title: editingTitle.trim() } : s,
        ),
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update session");
    }
  };

  // Cancel editing
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle("");
  };

  // Clear selection if it no longer exists in filtered results
  useEffect(() => {
    if (selected && !filtered.some((f) => f.id === selected)) {
      setSelected(null);
    }
  }, [search, filtered, selected]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col h-[80vh]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            {/* User Avatar - Click to Edit */}
            <button
              onClick={() => navigate("/profile", { state: { mode: "edit" } })}
              className="relative group h-10 w-10 rounded-full overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
              title="Edit Profile"
            >
              {/* Profile Image */}
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-full w-full object-cover group-hover:blur-sm transition-all duration-200"
                />
              ) : (
                <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:blur-sm transition-all duration-200">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}

              {/* Hover Overlay (The Pencil) */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            </button>

            {/* User Name */}
            <div className="flex flex-col">
              {isLoadingName ? (
                <div className="h-5 w-20 bg-slate-200 rounded animate-pulse"></div>
              ) : (
                <span className="text-slate-900 text-lg font-semibold font-['Sora'] leading-tight">
                  {userFirstName || "User"}
                </span>
              )}
            </div>
          </div>

          {/* Settings / Logout */}
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            title="Log out"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
            <svg
              className="w-5 h-5 text-slate-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 font-['Poppins']"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-auto -mx-2 px-2">
          <div className="space-y-1">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1287FF] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-slate-500 font-['Poppins']">
                  Loading sessions...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-slate-300 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 font-['Poppins']">
                  {search
                    ? "No matching sessions found"
                    : "No recordings found"}
                </p>
              </div>
            ) : (
              filtered.map((session) => {
                const isSelected = selected === session.id;
                const isHovered = hovered === session.id;
                const isEditing = editingId === session.id;
                const iconColor = getSentimentColor(session.sentiment);

                return (
                  <div
                    key={session.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (!isEditing) {
                        setSelected(session.id);
                        navigate(`/session/${session.id}`);
                      }
                    }}
                    onMouseEnter={() => setHovered(session.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`
                        w-full px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-200 border border-transparent
                        ${isSelected ? "bg-blue-50 border-blue-100" : isHovered ? "bg-slate-50" : "bg-white"}
                      `}
                  >
                    <div
                      className={`
                        p-2 rounded-lg flex-shrink-0
                        ${isSelected ? `bg-${iconColor}-100 text-${iconColor}-600` : `bg-${iconColor}-50 text-${iconColor}-500`}
                      `}
                      style={{
                        backgroundColor: isSelected
                          ? iconColor.bgSelected
                          : iconColor.bg,
                        color: isSelected
                          ? iconColor.textSelected
                          : iconColor.text,
                      }}
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
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>

                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <input
                          autoFocus
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 px-2 py-1 bg-transparent border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                          placeholder="Session title..."
                        />
                        <button
                          onClick={(e) => handleSaveTitle(session.id, e)}
                          className="flex-shrink-0 p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Save"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-shrink-0 p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                          title="Cancel"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm font-medium truncate ${isSelected ? "text-slate-900" : "text-slate-700"}`}
                          >
                            {session.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDate(session.createdAt)}
                          </p>
                        </div>

                        {isHovered ? (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={(e) =>
                                handleStartEdit(session.id, session.title, e)
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Rename"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={(e) =>
                                handleDeleteSession(session.id, e)
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="text-slate-300 flex-shrink-0">
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
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Floating Record Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => navigate("/record")}
          className="w-16 h-16 bg-[#1287FF] hover:bg-[#0f6fd6] text-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-200"
          aria-label="New Recording"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Helper function to format Firestore timestamp to readable date
function formatDate(timestamp: any): string {
  if (!timestamp) return "Unknown";

  let date: Date;
  if (timestamp.toDate) {
    // Firestore Timestamp
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return "Unknown";
  }

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}`;
}

// Helper function to get sentiment-based colors
function getSentimentColor(sentiment: string) {
  const colors: Record<string, any> = {
    Confident: {
      bg: "#dcfce7",
      bgSelected: "#bbf7d0",
      text: "#15803d",
      textSelected: "#166534",
    },
    Hesitant: {
      bg: "#fef9c3",
      bgSelected: "#fef08a",
      text: "#a16207",
      textSelected: "#854d0e",
    },
    Enthusiastic: {
      bg: "#dbeafe",
      bgSelected: "#bfdbfe",
      text: "#1d4ed8",
      textSelected: "#1e40af",
    },
    Anxious: {
      bg: "#fee2e2",
      bgSelected: "#fecaca",
      text: "#b91c1c",
      textSelected: "#991b1b",
    },
    Neutral: {
      bg: "#f1f5f9",
      bgSelected: "#e2e8f0",
      text: "#64748b",
      textSelected: "#475569",
    },
  };

  return colors[sentiment] || colors.Neutral;
}

export default DashboardPage;

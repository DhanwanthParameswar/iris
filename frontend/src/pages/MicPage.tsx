import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MicPage() {
  const [running, setRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0); // milliseconds
  const [revealed, setRevealed] = useState<boolean>(false);
  const [status, setStatus] = useState<string>(""); // show transient status like "Reset..."
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const statusTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
        statusTimeoutRef.current = null;
      }
    };
  }, []);

  const start = () => {
    // reveal UI permanently on the first start
    if (!revealed) setRevealed(true);
    // resume from precise millisecond offset so resumed time doesn't "snap" back
    startTimeRef.current = Date.now() - elapsedMs;
    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current == null) return;
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100); // frequent tick for smoothness
    setRunning(true);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // capture precise elapsed on stop so resume continues from same ms offset
    if (startTimeRef.current != null) {
      setElapsedMs(Date.now() - startTimeRef.current);
      startTimeRef.current = null;
    }
    setRunning(false);
  };

  const toggle = () => {
    if (running) stop();
    else start();
  };

  const reset = () => {
    stop();
    setElapsedMs(0);
    // show transient reset status
    setStatus("Recording has been reset...");
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = window.setTimeout(() => {
      statusTimeoutRef.current = null;
      // revert to paused when not running
      if (!running) setStatus("Paused");
      else setStatus("");
    }, 1500);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  // show UI either after first reveal or while timer is running / elapsed > 0
  const hasStarted = revealed || running || elapsedMs > 0;

  return (
    <div
      data-layer="MIC"
      className="Mic w-screen h-screen bg-[#f9fafb] inline-flex flex-col justify-center items-center gap-12 overflow-hidden"
    >
      {/* Top area (timer) - keep rendered to preserve layout, hide visually when inactive */}
      <div
        data-layer="Container"
        className="Container size- flex flex-col justify-start items-center"
      >
        <div
          data-layer="timer"
          className={`07 text-center justify-center text-slate-600/60 text-lg font-normal font-['Poppins'] leading-7 select-none transition-opacity duration-150 ${
            hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-live="polite"
          aria-hidden={!hasStarted}
        >
          {formatTime(elapsedMs)}
        </div>
      </div>

      {/* Middle area (mic + layered circles) */}
      <div
        data-layer="Container"
        className="Container size-48 relative inline-flex justify-center items-center"
      >
        {/* Largest and middle rings - keep present but toggle opacity so nothing moves when shown */}
        <div
          data-layer="Overlay"
          className={`Overlay size-48 left-0 top-0 absolute bg-[#1287ff]/10 rounded-full z-[10] transition-opacity duration-150 ${
            running ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!running}
        />
        <div
          data-layer="Overlay"
          className={`Overlay size-40 left-[16px] top-[16px] absolute bg-[#1287ff]/20 rounded-full z-[20] transition-opacity duration-150 ${
            running ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!running}
        />

        {/* Central mic button (always present, never moves). ring visual is present but invisible when inactive to avoid shifts */}
        <div
          data-layer="Background"
          className={`Background size-32 ${
            running ? "bg-[#1287ff]" : "bg-[#5f6b77]"
          } rounded-full flex justify-center items-center z-[30] cursor-pointer ring-4 ${
            running ? "ring-[#1287ff]/20" : "ring-[#5f6b77]/20"
          } ring-opacity-0 transition-all duration-150 ${
            running ? "ring-opacity-100" : ""
          }`}
          onClick={toggle}
          role="button"
          aria-pressed={running}
          aria-label={running ? "Stop stopwatch" : "Start stopwatch"}
        >
          <div data-svg-wrapper data-layer="Container" className="Container">
            <svg
              width="39"
              height="65"
              viewBox="0 0 39 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5 51.7857C24.0087 51.7857 28.3327 49.9796 31.5208 46.7647C34.7089 43.5498 36.5 39.1894 36.5 34.6429V30.3571M19.5 51.7857C14.9913 51.7857 10.6673 49.9796 7.47919 46.7647C4.29107 43.5498 2.5 39.1894 2.5 34.6429V30.3571M19.5 51.7857V62.5M8.875 62.5H30.125M19.5 43.2143C17.2457 43.2143 15.0837 42.3112 13.4896 40.7038C11.8955 39.0963 11 36.9161 11 34.6429V11.0714C11 8.79814 11.8955 6.61797 13.4896 5.01051C15.0837 3.40306 17.2457 2.5 19.5 2.5C21.7543 2.5 23.9163 3.40306 25.5104 5.01051C27.1045 6.61797 28 8.79814 28 11.0714V34.6429C28 36.9161 27.1045 39.0963 25.5104 40.7038C23.9163 42.3112 21.7543 43.2143 19.5 43.2143Z"
                stroke="white"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={1}
                opacity={1}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom controls - keep container rendered to preserve layout, hide controls visually when inactive */}
      <div
        data-layer="Container"
        className="Container size- pt-5 inline-flex justify-center items-start gap-6"
      >
        <div
          className={`w-full flex justify-center items-center gap-6 transition-opacity duration-150 ${
            hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Reset Recording Button */}
          <div
            data-layer="Button"
            className="Button size-16 bg-slate-200 rounded-2xl flex justify-center items-center cursor-pointer transition-colors duration-150 ease-in-out hover:bg-slate-300 active:scale-95"
            onClick={() => {
              // reset timer back to zero
              reset();
            }}
            role="button"
            aria-label="Reset recording"
          >
            <div data-svg-wrapper data-layer="Container" className="Container">
              <svg
                width="32"
                height="30"
                viewBox="0 0 32 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.0234 10.9825H29.4985L24.7352 6.1606C23.2017 4.60915 21.2915 3.49347 19.1966 2.9257C17.1017 2.35794 14.896 2.3581 12.8012 2.92618C10.7064 3.49426 8.79633 4.61023 7.26303 6.16191C5.72972 7.71359 4.62721 9.64628 4.06634 11.7657M2.50003 26.5798V19.0175M2.50003 19.0175H9.97516M2.50003 19.0175L7.26183 23.8394C8.79536 25.3908 10.7056 26.5065 12.8005 27.0743C14.8954 27.6421 17.1011 27.6419 19.1959 27.0738C21.2907 26.5057 23.2007 25.3898 24.734 23.8381C26.2673 22.2864 27.3699 20.3537 27.9307 18.2343M29.4985 3.42015V10.9795"
                  stroke="#475569"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Finish Recording Button — go to /analysis */}
          <div
            data-layer="Button"
            className="Button size-16 bg-slate-200 rounded-2xl flex justify-center items-center cursor-pointer transition-colors duration-150 ease-in-out hover:bg-slate-300 active:scale-95"
            onClick={() => {
              // stop timer and navigate to analysis
              stop();
              navigate("/analysis");
            }}
            role="button"
            aria-label="Finish recording"
          >
            <div data-svg-wrapper data-layer="Container" className="Container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 7C2.5 5.80653 2.97411 4.66193 3.81802 3.81802C4.66193 2.97411 5.80653 2.5 7 2.5H25C26.1935 2.5 27.3381 2.97411 28.182 3.81802C29.0259 4.66193 29.5 5.80653 29.5 7V25C29.5 26.1935 29.0259 27.3381 28.182 28.182C27.3381 29.0259 26.1935 29.5 25 29.5H7C5.80653 29.5 4.66193 29.0259 3.81802 28.182C2.97411 27.3381 2.5 26.1935 2.5 25V7Z"
                  stroke="#475569"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Cancel Recording Button — go to /library */}
          <div
            data-layer="Button"
            className="Button size-16 bg-slate-200 rounded-2xl flex justify-center items-center cursor-pointer transition-colors duration-150 ease-in-out hover:bg-slate-300 active:scale-95"
            onClick={() => {
              // stop/reset then navigate back to library
              stop();
              setElapsedMs(0);
              navigate("/library");
            }}
            role="button"
            aria-label="Cancel recording"
          >
            <div data-svg-wrapper data-layer="Container" className="Container">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 29.5L29.5 2.5M2.5 2.5L29.5 29.5"
                  stroke="#475569"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Listening text - kept to preserve layout, hidden when inactive */}
      <div
        data-layer="Container"
        className={`Container size- flex flex-col justify-start items-center transition-opacity duration-150 ${
          hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          data-layer="Listening... Speak now"
          className="ListeningSpeakNow text-center justify-center text-slate-600 text-lg font-normal font-['Poppins'] leading-7"
          aria-live="polite"
        >
          {status || (running ? "Listening... Speak now" : "Paused")}
        </div>
      </div>
    </div>
  );
}

export default MicPage;

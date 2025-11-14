import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LibraryPage() {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const entries = [
    {
      id: "amazon",
      name: "Amazon",
      icon: (
        <svg
          width="21"
          height="24"
          viewBox="0 0 21 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.75 12.76C0.75 14.36 1.873 15.754 3.457 15.987C4.544 16.147 5.642 16.27 6.75 16.356V21L10.826 16.924C11.1024 16.6493 11.4735 16.4909 11.863 16.481C13.7644 16.4284 15.661 16.2634 17.543 15.987C19.127 15.754 20.25 14.361 20.25 12.759V6.741C20.25 5.139 19.127 3.746 17.543 3.513C15.211 3.17072 12.857 2.99926 10.5 3C8.108 3 5.756 3.175 3.457 3.513C1.873 3.746 0.75 5.14 0.75 6.741V12.759V12.76Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "google",
      name: "Google",
      icon: (
        <svg
          width="21"
          height="24"
          viewBox="0 0 21 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.75 12.76C0.75 14.36 1.873 15.754 3.457 15.987C4.544 16.147 5.642 16.27 6.75 16.356V21L10.826 16.924C11.1024 16.6493 11.4735 16.4909 11.863 16.481C13.7644 16.4284 15.661 16.2634 17.543 15.987C19.127 15.754 20.25 14.361 20.25 12.759V6.741C20.25 5.139 19.127 3.746 17.543 3.513C15.211 3.17072 12.857 2.99926 10.5 3C8.108 3 5.756 3.175 3.457 3.513C1.873 3.746 0.75 5.14 0.75 6.741V12.759V12.76Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const filtered = entries.filter((e) =>
    e.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Clear selection if it no longer exists in filtered results
  useEffect(() => {
    if (selected && !filtered.some((f) => f.id === selected)) {
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div
      data-layer="LIBRARY"
      className="Library w-screen min-h-screen px-10 py-7 relative bg-[#f9fafb] inline-flex flex-col justify-start items-center gap-2.5 overflow-hidden"
    >
      <div
        data-layer="Container"
        className="Container w-full max-w-[600px] mx-auto pt-5 flex flex-col justify-start items-center gap-4"
      >
        <div
          data-layer="Container"
          className="Container self-stretch h-11 flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div
              data-svg-wrapper
              data-layer="Vector"
              className="Vector cursor-pointer transition-opacity duration-200 hover:opacity-80"
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.8856 29.2055C26.6434 27.5608 25.0362 26.227 23.1908 25.3092C21.3453 24.3914 19.312 23.9146 17.2509 23.9165C15.1898 23.9146 13.1565 24.3914 11.311 25.3092C9.46556 26.227 7.85843 27.5608 6.61623 29.2055M27.8856 29.2055C30.3096 27.0493 32.0191 24.2073 32.7908 21.0562C33.5624 17.9051 33.358 14.5938 32.2046 11.5616C31.0512 8.52936 29.0033 5.91937 26.3325 4.07778C23.6617 2.23619 20.4942 1.25 17.25 1.25C14.0058 1.25 10.8383 2.23619 8.16752 4.07778C5.49671 5.91937 3.44881 8.52936 2.2954 11.5616C1.14198 14.5938 0.937561 17.9051 1.70924 21.0562C2.48091 24.2073 4.19222 27.0493 6.61623 29.2055M27.8856 29.2055C24.9594 31.8156 21.172 33.2556 17.2509 33.25C13.3292 33.256 9.54286 31.816 6.61623 29.2055M22.5842 13.2497C22.5842 14.6642 22.0223 16.0208 21.0221 17.021C20.0219 18.0212 18.6654 18.5831 17.2509 18.5831C15.8364 18.5831 14.4798 18.0212 13.4797 17.021C12.4795 16.0208 11.9176 14.6642 11.9176 13.2497C11.9176 11.8352 12.4795 10.4786 13.4797 9.47837C14.4798 8.47816 15.8364 7.91625 17.2509 7.91625C18.6654 7.91625 20.0219 8.47816 21.0221 9.47837C22.0223 10.4786 22.5842 11.8352 22.5842 13.2497Z"
                  stroke="#1287ff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              data-layer="Container"
              className="Container size- inline-flex flex-col justify-start items-start"
            >
              <div
                data-layer="Heading 1"
                className="Heading1 self-stretch flex flex-col justify-start items-start"
              >
                <div
                  data-layer="Alex Doe"
                  className="AlexDoe justify-center text-slate-900 text-2xl font-semibold font-['Sora'] leading-6"
                >
                  Alex Doe
                </div>
              </div>
            </div>
          </div>
          <div
            data-layer="Container"
            className="Container flex items-center justify-end"
          >
            <div
              data-svg-wrapper
              data-layer="Icon"
              className="Icon cursor-pointer transition-opacity duration-200 hover:opacity-80"
            >
              <svg
                width="31"
                height="35"
                viewBox="0 0 31 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2187 5.01444C11.3637 4.14122 12.1209 3.5 13.007 3.5H17.1846C18.0708 3.5 18.828 4.14122 18.973 5.01444L19.3161 7.07828C19.4176 7.68083 19.8204 8.1835 20.3553 8.47994C20.4745 8.54439 20.5921 8.61367 20.7098 8.68456C21.2334 9.00033 21.8698 9.09861 22.4417 8.88433L24.4024 8.14967C24.8042 7.99856 25.2466 7.99497 25.6508 8.13954C26.055 8.28411 26.3948 8.56745 26.6096 8.93911L28.6976 12.5593C28.912 12.931 28.9876 13.3667 28.9109 13.7888C28.8342 14.211 28.6102 14.5923 28.2788 14.8648L26.6628 16.1972C26.1908 16.5854 25.9571 17.1848 25.97 17.7954C25.9723 17.9323 25.9723 18.0693 25.97 18.2062C25.9571 18.8152 26.1908 19.4146 26.6628 19.8028L28.2804 21.1352C28.9635 21.6991 29.1407 22.6738 28.6993 23.4391L26.608 27.0593C26.3935 27.4309 26.0541 27.7143 25.6502 27.8591C25.2464 28.004 24.8042 28.0009 24.4024 27.8503L22.4417 27.1157C21.8698 26.9014 21.2334 26.9997 20.7081 27.3154C20.5914 27.3865 20.4732 27.4553 20.3537 27.5217C19.8204 27.8165 19.4176 28.3192 19.3161 28.9217L18.973 30.9856C18.828 31.8604 18.0708 32.5 17.1846 32.5H13.0054C12.1193 32.5 11.3637 31.8588 11.2171 30.9856L10.8739 28.9217C10.774 28.3192 10.3713 27.8165 9.83636 27.5201C9.7169 27.4542 9.59873 27.3859 9.48192 27.3154C8.95831 26.9997 8.32192 26.9014 7.74836 27.1157L5.78764 27.8503C5.38604 28.001 4.94401 28.0044 4.54016 27.8598C4.13631 27.7153 3.79681 27.4322 3.58203 27.0609L1.49242 23.4407C1.27805 23.069 1.2025 22.6333 1.2792 22.2112C1.3559 21.789 1.57989 21.4077 1.91131 21.1352L3.52886 19.8028C3.99931 19.4162 4.23292 18.8152 4.22164 18.2062C4.21912 18.0693 4.21912 17.9323 4.22164 17.7954C4.23292 17.1832 3.99931 16.5854 3.52886 16.1972L1.91131 14.8648C1.58029 14.5923 1.35656 14.2114 1.27987 13.7896C1.20318 13.3678 1.27849 12.9324 1.49242 12.5609L3.58203 8.94072C3.79661 8.56878 4.13627 8.28509 4.5405 8.14022C4.94473 7.99535 5.38726 7.99869 5.78925 8.14967L7.74836 8.88433C8.32192 9.09861 8.95831 9.00033 9.48192 8.68456C9.59792 8.61367 9.71714 8.546 9.83636 8.47833C10.3713 8.1835 10.774 7.68083 10.8739 7.07828L11.2187 5.01444Z"
                  stroke="black"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M19.9283 18C19.9283 19.2818 19.419 20.5112 18.5126 21.4176C17.6062 22.3241 16.3768 22.8333 15.0949 22.8333C13.8131 22.8333 12.5837 22.3241 11.6772 21.4176C10.7708 20.5112 10.2616 19.2818 10.2616 18C10.2616 16.7181 10.7708 15.4887 11.6772 14.5823C12.5837 13.6759 13.8131 13.1666 15.0949 13.1666C16.3768 13.1666 17.6062 13.6759 18.5126 14.5823C19.419 15.4887 19.9283 16.7181 19.9283 18Z"
                  stroke="black"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div
          data-layer="Container"
          className="Container self-stretch py-1 flex flex-col justify-start items-start"
        >
          <div
            data-layer="Label"
            className="Label self-stretch h-11 min-w-40 flex flex-col justify-center items-start"
          >
            <div
              data-layer="Container"
              className="Container self-stretch flex-1 rounded-lg inline-flex justify-start items-start"
            >
              <div
                data-layer="Background+Border"
                className="BackgroundBorder self-stretch pl-3 py-px bg-transparent rounded-tl-lg rounded-bl-lg border-l border-t border-b border-slate-300 flex justify-center items-center"
              >
                <div
                  data-layer="Container"
                  className="Container size- py-0.5 inline-flex flex-col justify-start items-start"
                >
                  <div
                    data-svg-wrapper
                    data-layer="Icon"
                    className="Icon relative"
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3333 19.5L11.0833 14.25C10.6667 14.5833 10.1875 14.8472 9.64583 15.0417C9.10417 15.2361 8.52778 15.3333 7.91667 15.3333C6.40278 15.3333 5.12153 14.809 4.07292 13.7604C3.02431 12.7118 2.5 11.4306 2.5 9.91667C2.5 8.40278 3.02431 7.12153 4.07292 6.07292C5.12153 5.02431 6.40278 4.5 7.91667 4.5C9.43056 4.5 10.7118 5.02431 11.7604 6.07292C12.809 7.12153 13.3333 8.40278 13.3333 9.91667C13.3333 10.5278 13.2361 11.1042 13.0417 11.6458C12.8472 12.1875 12.5833 12.6667 12.25 13.0833L17.5 18.3333L16.3333 19.5ZM7.91667 13.6667C8.95833 13.6667 9.84375 13.3021 10.5729 12.5729C11.3021 11.8438 11.6667 10.9583 11.6667 9.91667C11.6667 8.875 11.3021 7.98958 10.5729 7.26042C9.84375 6.53125 8.95833 6.16667 7.91667 6.16667C6.875 6.16667 5.98958 6.53125 5.26042 7.26042C4.53125 7.98958 4.16667 8.875 4.16667 9.91667C4.16667 10.9583 4.53125 11.8438 5.26042 12.5729C5.98958 13.3021 6.875 13.6667 7.91667 13.6667Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                data-layer="Input"
                className="Input flex-1 self-stretch relative bg-transparent rounded-tr-lg rounded-br-lg border-r border-t border-b border-slate-300 overflow-hidden"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full h-10 px-3 text-sm text-slate-500 bg-transparent outline-none placeholder:text-slate-500 font-['Poppins'] leading-10"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-500"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L11 11M11 1L1 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          data-layer="Container"
          className="Container self-stretch flex flex-col justify-start items-start gap-1"
        >
          {filtered.length === 0 ? (
            <div className="text-sm text-slate-500 py-3 font-['Poppins']">
              No results
            </div>
          ) : (
            filtered.map((entry) => {
              const isSelected = selected === entry.id;
              const isHovered = hovered === entry.id;
              const bg = isSelected
                ? "rgba(37,140,244,0.1)" // selected color (#258CF4 @10%)
                : isHovered
                ? "rgba(37,140,244,0.06)"
                : "transparent";

              return (
                <div
                  key={entry.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(entry.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(entry.id);
                    }
                  }}
                  onMouseEnter={() => setHovered(entry.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="self-stretch px-3 py-2 rounded-lg inline-flex justify-start items-center gap-3 cursor-pointer transition-colors"
                  style={{ backgroundColor: bg }}
                >
                  <div
                    data-layer="Container"
                    className="Container size- py-0.5 inline-flex flex-col justify-start items-start"
                  >
                    <div
                      data-svg-wrapper
                      data-layer="Icon"
                      className={`Icon relative ${
                        isSelected ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {entry.icon}
                    </div>
                  </div>
                  <div
                    data-layer="Container"
                    className="Container size- inline-flex flex-col justify-start items-start"
                  >
                    <div
                      className={
                        "text-sm font-['Poppins'] " +
                        (isSelected
                          ? "text-slate-900 font-medium"
                          : "text-slate-600")
                      }
                    >
                      {entry.name}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div
        data-layer="Frame 2"
        className="Frame2 w-[100px] h-[100px] bottom-[50px] right-[50px] fixed z-50"
      >
        <button
          type="button"
          onClick={() => navigate("/mic")}
          data-layer="Button"
          aria-label="Add conversation"
          className="Button w-full h-full rounded-[20px] inline-flex justify-center items-center overflow-hidden bg-[#1287FF] text-white shadow-xl cursor-pointer transition-colors transition-shadow duration-300 ease-in-out hover:shadow-none hover:bg-[#0f6fd6] focus:outline-none focus:ring-2 focus:ring-[#1287FF]/30"
          style={{
            transition: "background-color 300ms ease, box-shadow 300ms ease",
          }}
        >
          <div data-svg-wrapper data-layer="Vector" className="Vector">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5 3V38M38 20.5H3"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default LibraryPage;

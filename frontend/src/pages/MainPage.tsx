import { useNavigate } from "react-router-dom";
import mascotUrl from "../assets/mascot.svg";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div
      data-layer="MAIN"
      className="Main min-h-screen w-full bg-gray-50 flex flex-col items-center relative"
    >
      <header
        data-layer="Header"
        className="Header fixed top-0 left-0 w-full h-[55px] flex items-center justify-center z-30"
      >
        <nav
          data-layer="Nav"
          className="Nav w-full flex items-center justify-center max-w-[1536px]"
        >
          <div
            data-layer="Container"
            className="Container flex items-center gap-2"
          >
            {/* Iris positioned 55px from top and centered horizontally */}
            <div
              data-layer="Iris"
              className="Iris fixed left-1/2 top-[55px] transform -translate-x-1/2 font-['Sora'] font-bold text-[48px] leading-none text-gray-800"
            >
              Iris
            </div>
          </div>
        </nav>
      </header>

      <main
        data-layer="Container"
        className="Container absolute inset-0 flex items-center justify-center"
      >
        {/* fixed-size, non-scaling content container */}
        <div className="w-[440px] px-10 py-8 flex flex-col items-center gap-5">
          <img
            data-layer="image 1"
            className="Image1 w-[212px] h-[196px] rounded-[106px] object-cover"
            src={mascotUrl}
            alt="hero"
          />

          <div
            data-layer="Heading 1"
            className="Heading1 w-full flex flex-col items-stretch"
          >
            <div className="w-full text-center">
              <div className="w-full text-gray-800 font-['Sora'] font-bold text-[39px] leading-[45px]">
                Meet Your New <span className="text-[#1287FF]">AI</span>
              </div>
              <div className="w-full text-[#1287FF] font-['Sora'] font-bold text-[39px] leading-[45px]">
                Career Fair Coach
              </div>
            </div>
          </div>

          <div data-layer="Container" className="Container w-full text-center">
            <div
              data-layer="Turn recruiter chats into job offers. Record, analyze, and get your follow-ups written for you."
              className="text-gray-500 text-[12px] font-['Poppins'] font-normal pb-[10px]"
            >
              Turn recruiter chats into job offers. Record, analyze, and get
              your follow-ups written for you.
            </div>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="button"
              data-layer="Button"
              className="Button cursor-pointer px-8 py-3 bg-[#1287FF] rounded-2xl shadow-xl text-white text-[18px] font-['Sora'] font-semibold transition-colors transition-shadow duration-300 ease-in-out hover:shadow-none hover:bg-[#0f6fd6] focus:outline-none focus:ring-2 focus:ring-[#1287FF]/30"
              style={{
                transition:
                  "background-color 300ms ease, box-shadow 300ms ease",
              }}
              onClick={() => navigate("/profile")}
            >
              Start Recording
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

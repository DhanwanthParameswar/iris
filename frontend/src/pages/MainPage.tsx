import "./MainPage.css";

function MainPage() {
  return (
    <div
      data-layer="MAIN"
      className="Main w-96 h-[956px] bg-gray-50 inline-flex flex-col justify-start items-start"
    >
      <div
        data-layer="Container"
        className="Container self-stretch flex-1 relative flex flex-col justify-start items-center"
      >
        <div
          data-layer="Header"
          className="Header self-stretch h-28 px-48 py-6 flex flex-col justify-end items-center"
        >
          <div
            data-layer="Nav"
            className="Nav w-full max-w-[1536px] pr-[0.01px] inline-flex justify-between items-center"
          >
            <div
              data-layer="Container"
              className="Container size- flex justify-start items-center gap-2"
            >
              <div
                data-layer="Iris"
                className="Iris justify-center text-gray-800 text-5xl font-bold font-['Sora'] leading-7"
              >
                Iris
              </div>
            </div>
          </div>
        </div>
        <div
          data-layer="Container"
          className="Container w-96 h-[849px] px-10 pt-5 pb-20 left-0 top-[54px] absolute flex flex-col justify-center items-center gap-5"
        >
          <img
            data-layer="image 1"
            className="Image1 w-52 h-48 rounded-[106px]"
            src="https://placehold.co/212x196"
          />
          <div
            data-layer="Heading 1"
            className="Heading1 self-stretch flex flex-col justify-start items-center"
          >
            <div
              data-layer="Meet Your New AI Career Fair Coach"
              className="MeetYourNewAiCareerFairCoach self-stretch text-center justify-center"
            >
              <span className="text-gray-800 text-4xl font-bold font-['Sora'] leading-10">
                Meet Your New{" "}
              </span>
              <span className="text-sky-500 text-4xl font-bold font-['Sora'] leading-10">
                AI
                <br />
                Career Fair Coach
              </span>
            </div>
          </div>
          <div
            data-layer="Container"
            className="Container w-full max-w-[576px] pb-2.5 flex flex-col justify-start items-center"
          >
            <div
              data-layer="Turn recruiter chats into job offers. Record, analyze, and get your follow-ups written for you."
              className="TurnRecruiterChatsIntoJobOffersRecordAnalyzeAndGetYourFollowUpsWrittenForYou self-stretch text-center justify-center text-gray-500 text-xs font-normal font-['Poppins'] leading-5"
            >
              Turn recruiter chats into job offers. Record, analyze, and get
              your follow-ups written for you.
            </div>
          </div>
          <div
            data-layer="Button"
            className="Button size- px-8 py-3 bg-sky-500 rounded-2xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg inline-flex justify-center items-center overflow-hidden"
          >
            <div
              data-layer="Start Recording"
              className="StartRecording text-center justify-center text-white text-lg font-semibold font-['Sora'] leading-7"
            >
              Start Recording
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;

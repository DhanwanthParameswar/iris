import React from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div
      data-layer="PROFILE"
      className="Profile w-96 h-[956px] p-5 bg-slate-50 inline-flex flex-col justify-center items-center"
    >
      <div
        data-layer="Container"
        className="Container w-full flex-1 max-w-[600px] px-5 inline-flex justify-center items-center"
      >
        <div
          data-layer="Container"
          className="Container flex-1 h-[903px] inline-flex flex-col justify-center items-center"
        >
          <div
            data-layer="Container"
            className="Container self-stretch flex flex-col justify-center items-center gap-2"
          >
            <div
              data-layer="Heading 1"
              className="Heading1 self-stretch flex flex-col justify-start items-start"
            >
              <div
                data-layer="Your Profile"
                className="YourProfile self-stretch text-center justify-center text-slate-900 text-4xl font-bold font-['Sora'] leading-10"
              >
                Your Profile
              </div>
            </div>
            <div
              data-layer="Container"
              className="Container self-stretch py-5 flex flex-col justify-start items-start"
            >
              <div
                data-layer="Enter your personal information and resume."
                className="EnterYourPersonalInformationAndResume self-stretch h-6 text-center justify-center text-slate-500 text-base font-normal font-['Poppins'] leading-6"
              >
                Enter your personal information and resume.
              </div>
            </div>
          </div>
          <div
            data-layer="Form"
            className="Form self-stretch flex flex-col justify-start items-start gap-8"
          >
            <div
              data-layer="Container"
              className="Container self-stretch flex flex-col justify-start items-center gap-8"
            >
              <div
                data-layer="Container"
                className="Container self-stretch h-64 flex flex-col justify-start items-start gap-6"
              >
                <div
                  data-layer="Container"
                  className="Container self-stretch flex flex-col justify-start items-start gap-2"
                >
                  <div
                    data-layer="Label"
                    className="Label self-stretch flex flex-col justify-start items-start"
                  >
                    <div
                      data-layer="Full Name"
                      className="FullName self-stretch justify-center text-slate-600 text-sm font-medium font-['Poppins'] leading-5"
                    >
                      Full Name
                    </div>
                  </div>
                  <div
                    data-layer="Input"
                    className="Input self-stretch px-3 py-2 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-start items-start overflow-hidden"
                  >
                    <div
                      data-layer="Container"
                      className="Container self-stretch flex flex-col justify-start items-start overflow-hidden"
                    >
                      <div
                        data-layer="Alex Doe"
                        className="AlexDoe self-stretch justify-center text-slate-800 text-base font-normal font-['Poppins'] leading-6"
                      >
                        Alex Doe
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  data-layer="Container"
                  className="Container self-stretch flex flex-col justify-start items-start gap-2"
                >
                  <div
                    data-layer="Label"
                    className="Label self-stretch flex flex-col justify-start items-start"
                  >
                    <div
                      data-layer="Email Address"
                      className="EmailAddress self-stretch justify-center text-slate-600 text-sm font-medium font-['Poppins'] leading-5"
                    >
                      Email Address
                    </div>
                  </div>
                  <div
                    data-layer="Input"
                    className="Input self-stretch px-3 py-2 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-start items-start overflow-hidden"
                  >
                    <div
                      data-layer="Container"
                      className="Container self-stretch flex flex-col justify-start items-start overflow-hidden"
                    >
                      <div
                        data-layer="alex.doe@example.com"
                        className="AlexDoeExampleCom self-stretch justify-center text-slate-800 text-base font-normal font-['Poppins'] leading-6"
                      >
                        alex.doe@example.com
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  data-layer="Container"
                  className="Container self-stretch flex flex-col justify-start items-start gap-2"
                >
                  <div
                    data-layer="Label"
                    className="Label self-stretch flex flex-col justify-start items-start"
                  >
                    <div
                      data-layer="Phone Number"
                      className="PhoneNumber self-stretch justify-center text-slate-600 text-sm font-medium font-['Poppins'] leading-5"
                    >
                      Phone Number
                    </div>
                  </div>
                  <div
                    data-layer="Input"
                    className="Input self-stretch px-3 py-2 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-start items-start overflow-hidden"
                  >
                    <div
                      data-layer="Container"
                      className="Container self-stretch flex flex-col justify-start items-start overflow-hidden"
                    >
                      <div
                        data-layer="+1 (555) 123-4567"
                        className="15551234567 self-stretch justify-center text-slate-800 text-base font-normal font-['Poppins'] leading-6"
                      >
                        +1 (555) 123-4567
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-layer="Container"
                className="Container self-stretch h-64 flex flex-col justify-start items-start"
              >
                <div
                  data-layer="Label:margin"
                  className="LabelMargin self-stretch pb-2 flex flex-col justify-start items-start"
                >
                  <div
                    data-layer="Label"
                    className="Label self-stretch flex flex-col justify-start items-start"
                  >
                    <div
                      data-layer="Your Resume"
                      className="YourResume self-stretch justify-center text-slate-600 text-sm font-medium font-['Poppins'] leading-5"
                    >
                      Your Resume
                    </div>
                  </div>
                </div>
                <div
                  data-layer="Label"
                  className="Label self-stretch h-56 p-0.5 bg-slate-50 rounded-lg outline outline-2 outline-offset-[-2px] outline-slate-300 flex flex-col justify-center items-center"
                >
                  <div
                    data-layer="Container"
                    className="Container w-64 h-40 relative"
                  >
                    <div
                      data-svg-wrapper
                      data-layer="Container"
                      className="Container left-[111.73px] top-[29px] absolute"
                    >
                      <svg
                        width="42"
                        height="33"
                        viewBox="0 0 42 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.0107 25.5122V12.0398M21.0107 12.0398L27.011 18.0276M21.0107 12.0398L15.0104 18.0276M10.5102 31.5C8.36898 31.5023 6.29706 30.7428 4.66653 29.3578C3.03601 27.9727 1.95372 26.053 1.61401 23.9433C1.27431 21.8336 1.69945 19.6721 2.81309 17.8471C3.92673 16.0221 5.6559 14.653 7.69008 13.9858C7.16746 11.3136 7.7076 8.54336 9.19612 6.26166C10.6846 3.97996 13.0047 2.36599 15.6649 1.76154C18.3251 1.15708 21.1166 1.60961 23.4483 3.02328C25.78 4.43696 27.4688 6.70077 28.157 9.33534C29.2211 8.99 30.3607 8.94845 31.4472 9.21538C32.5337 9.48231 33.5238 10.0471 34.3056 10.8459C35.0873 11.6448 35.6297 12.6458 35.8714 13.7361C36.1131 14.8263 36.0445 15.9622 35.6734 17.0156C37.3108 17.6398 38.6776 18.8161 39.5367 20.3407C40.3958 21.8653 40.6931 23.6419 40.3769 25.3623C40.0607 27.0827 39.151 28.6384 37.8056 29.7595C36.4602 30.8806 34.764 31.4964 33.0113 31.5H10.5102Z"
                          stroke="#94A3B8"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      data-layer="Margin"
                      className="Margin size- pb-2 left-[16px] top-[68px] absolute inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Container"
                        className="Container size- flex flex-col justify-start items-center"
                      >
                        <div
                          data-layer="Click to upload or drag and drop"
                          className="ClickToUploadOrDragAndDrop text-center justify-center"
                        >
                          <span className="text-slate-500 text-sm font-semibold font-['Poppins'] leading-5">
                            Click to upload
                          </span>
                          <span className="text-slate-500 text-sm font-normal font-['Poppins'] leading-5">
                            {" "}
                            or drag and drop
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      data-layer="Container"
                      className="Container size- left-[48.55px] top-[96px] absolute inline-flex flex-col justify-start items-center"
                    >
                      <div
                        data-layer="PDF, DOC, DOCX (MAX. 5MB)"
                        className="PdfDocDocxMax5mb text-center justify-center text-slate-500 text-xs font-normal font-['Poppins'] leading-4"
                      >
                        PDF, DOC, DOCX (MAX. 5MB)
                      </div>
                    </div>
                    <div
                      data-layer="Margin"
                      className="Margin size- pt-4 left-[43.66px] top-[112px] absolute inline-flex flex-col justify-start items-start"
                    >
                      <div
                        data-layer="Container"
                        className="Container size- flex flex-col justify-start items-center"
                      >
                        <div
                          data-layer="resume_alex_doe_2024.pdf"
                          className="ResumeAlexDoe2024Pdf text-center justify-center text-sky-500 text-xs font-medium font-['Poppins'] leading-4"
                        >
                          resume_alex_doe_2024.pdf
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-layer="HorizontalBorder"
              className="Horizontalborder self-stretch pt-4 relative border-t border-slate-200 inline-flex justify-end items-start"
            >
              <div
                data-layer="Button"
                className="Button w-40 h-12 px-6 py-3 left-[95px] top-[17px] absolute bg-sky-500 rounded-2xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center gap-2.5 cursor-pointer"
                onClick={() => navigate("/library")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/library");
                }}
              >
                <div
                  data-layer="Confirm"
                  className="Confirm text-center justify-center text-white text-lg font-semibold font-['Sora'] leading-6"
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

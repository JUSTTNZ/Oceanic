import React, { useState } from "react";
import Header from "./login/header";
import Footer from "./login/footer";

const options = [
  "To invest in crypto for profit",
  "Trading on Oceanic",
  "Trading on other exchanges",
  "To create a USD savings plan",
  "Send and Receive Funds",
  "Business",
];

const SignupSurvey: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <section>
        <Header />
  <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-20 lg:pt-30 pb-20 p-4 font-poppins">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-center mb-4">
          What will you primarily use Oceanic for?
        </h2>
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full py-3 px-4 border rounded-lg text-left transition-colors duration-200 focus:outline-none ${
                selectedOption === option
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg  transition-colors duration-200"
          disabled={!selectedOption}
        >
          Submit
        </button>
        <button
          className="w-full mt-4 py-3 bg-tranparent text-black rounded-lg border border-[#D5D2E5]  transition-colors duration-200"
       
        >
        Skip
        </button>
      </div>
    </div>
    <Footer />
    </section>
  
  );
};

export default SignupSurvey;
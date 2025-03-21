import React, { useState } from "react";
import { FaChevronRight, FaUser } from "react-icons/fa";
import Footer from "./login/footer";
import Header from "./login/header";

const VerificationPage = () => {
  const [step, setStep] = useState(1);

  return (
    <section>
        <Header />
        <nav className="flex items-center text-[#5A5A5A] bg-white w-full text-[14px] font-medium pt-20 px-9 p-6 border-b border-white">
      <span className="cursor-pointer hover:underline">My Account</span>
      <FaChevronRight className="mx-2 text-[12px] text-gray-400" />
      <span className="cursor-pointer hover:underline">Identity Verification</span>
      <FaChevronRight className="mx-2 text-[12px] text-gray-400" />
      <span className="text-black font-semibold">Basic</span>
    </nav>
 <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-maven">


      
      {/* Main Content */}
      <div className="bg-white w-full max-w-6xl  p-6 rounded-lg shadow-md">
      
          <div className="p-4">
            <h2 className="text-4xl font-semibold mb-4">Basic Verification</h2>
            <p className="text-gray-600 mb-4">
              Complete the required information below then click &#39;Submit&#39; when you&lsquo;re done.
            </p>
            <hr className="border-t border-[#D5D2E5] my-4" />

            <p className="text-gray-600 mb-4">
            You’ll be required to choose one of the verification options listed below and take a realtime selfie to complete this level.

For any verification, you are required to have one of these:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>International Passport</li>
              <li>National ID Card</li>
              <li>Driver&lsquo;s License</li>
            </ul>
        
          </div>
   
          <div className="text-center">
            <div className="flex flex-col">
            <div
  className="p-4 border rounded-lg cursor-pointer h-40 bg-gray-100 flex justify-center items-center flex flex-col"

>
    <span className="flex justify-center"><FaUser className="text-[#59547a]" /> </span>
<span className="pt-4">  Click here to begin ID document and live selfie capturing.</span>
</div>
<div className="flex items-start pt-3">
<button className="text-purple-700 underline mb-4" >Start Again</button>
</div>

    
            </div>

            <div className="flex justify-between space-x-4">
              <button className="border-gray-200 border px-4 py-3 rounded-lg w-full ">Back</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Submit</button>
            </div>
          </div>
  
      </div>
    </div>
    <Footer />
    </section>
   
  );
};

export default VerificationPage;

"use client";

import Image from "next/image";
import {
    BoltIcon,
    LockClosedIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default function WhyOceanic() {
    return (
        <section className="flex flex-col md:gap-16 md:flex-row items-center justify-center min-h-screen bg-white text-gray-900 py-12 px-6 md:px-16 font-grotesk">
            {/* Left Side - Image */}
            <div className="flex justify-center h-[500px]">
                <Image 
                    src="/Images/phone1.png"
                    alt="phone"
                    width={300}
                    height={500}
                    className="rounded-lg"
                />
            </div>

         
            <div className="max-w-3xl text-center md:text-left">
                <h1 className="text-4xl font-bold text-[#0f0c29] mb-4">Why Choose Oceanic?</h1>
                <p className="text-gray-600 text-lg">
                    We simplify the complexities of crypto trading, ensuring seamless transactions with top-tier security and support.
                </p>

          
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
                    <div className="flex items-start space-x-4">
                        <BoltIcon className="w-8 h-8 lg:h-20 lg-w-20 pb-0 lg:pb-10 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Lightning-Fast Transactions</h3>
                            <p className="text-gray-600 text-sm">
                                Experience instant trades without unnecessary delays, making every second count.
                            </p>
                        </div>
                    </div>

                   
                    <div className="flex items-start space-x-4">
                        <LockClosedIcon className="w-8 h-8 lg:h-20 lg-w-20 pb-0 lg:pb-10 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Ironclad Security</h3>
                            <p className="text-gray-600 text-sm">
                                Your assets are fortified with advanced encryption, ensuring protection from cyber threats.
                            </p>
                        </div>
                    </div>

              
                    <div className="flex items-start space-x-4">
                        <CurrencyDollarIcon className="w-8 h-8 lg:h-20 lg-w-20 pb-0 lg:pb-10 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Diverse Crypto Portfolio</h3>
                            <p className="text-gray-600 text-sm">
                                Gain access to a vast array of digital currencies, from mainstream coins to emerging tokens.
                            </p>
                        </div>
                    </div>

                  
                    <div className="flex items-start space-x-4">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 lg:h-20 lg-w-20 pb-0 lg:pb-10 text-blue-600 " />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Always-On Support</h3>
                            <p className="text-gray-600 text-sm">
                                Day or night, our dedicated team is just a message away, ready to assist you 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

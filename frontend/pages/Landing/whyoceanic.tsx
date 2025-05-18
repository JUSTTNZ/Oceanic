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
        <section className="relative overflow-hidden bg-white text-gray-900 py-16 px-4 sm:px-6 lg:px-8 xl:px-16 font-grotesk">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 xl:gap-24">
                {/* Left Side - Image with responsive sizing */}
                    <div className="flex justify-center h-[500px]">
                <Image 
                    src="/Images/phone1.png"
                    alt="phone"
                    width={300}
                    height={500}
                    className="rounded-lg"
                />
            </div>

                {/* Right Side - Content */}
                <div className="w-full lg:w-2/2 max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f0c29] mb-6 leading-tight">
                        Why Choose Oceanic?
                    </h1>
                    <p className="text-gray-600 text-lg sm:text-xl mb-10 md:mb-12">
                        We simplify the complexities of crypto trading, ensuring seamless transactions with top-tier security and support.
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                                <BoltIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Lightning-Fast Transactions</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Experience instant trades without unnecessary delays, making every second count.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                                <LockClosedIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Ironclad Security</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Your assets are fortified with advanced encryption, ensuring protection from cyber threats.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                                <CurrencyDollarIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Diverse Crypto Portfolio</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Gain access to a vast array of digital currencies, from mainstream coins to emerging tokens.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Always-On Support</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Day or night, our dedicated team is just a message away, ready to assist you 24/7.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
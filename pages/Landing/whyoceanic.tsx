"use-client"
import Image from 'next/image'
export default function WhyOceanic() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f0c29] text-white">
        <div>
            <Image 
                src= "/Images/phone.png"
                alt='phone'
            />
        </div>
        <div>
            <h1 className="text-4xl font-bold mb-8">Why Oceanic?</h1>
            <p className="text-lg mb-4">Oceanic is the best place to trade and invest in cryptocurrencies.</p>
            <p className="text-lg mb-4">Join us and experience the future of finance.</p>
            <button className="bg-[#0047AB] text-white px-6 py-3 rounded-md hover:bg-[#003399] transition duration-300">
                Get Started
            </button>
        </div>
        
        </div>
    );
}
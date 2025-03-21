// /src/components/Hero.tsx
"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0047AB] mb-6 leading-tight">Buy and sell <br /> crypto with ease</h1>
          <p className="text-lg text-gray-600 mb-8">Oceanic makes it simple to trade cryptocurrency securely and globally. Join us and start today!</p>
          <div className="flex space-x-4">
            <input type="email" placeholder="Your e-mail" className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none w-64" />
            <button className="bg-[#0047AB] text-white px-6 py-3 rounded-md hover:bg-[#0b5ce9]">Get Started</button>
          </div>
        </div>
        <div className="relative">
          <Image src="/Images/hero.webp" alt="Phone Mockup" width={400} height={700} className="mx-auto" />
        </div>
      </div>
    </section>
  );
}
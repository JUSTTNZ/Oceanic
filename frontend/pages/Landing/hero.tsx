"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import hero from '../../public/Images/hero.webp'
import Link from "next/link";

export default function Hero() {

  const imageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);


  useEffect(() => {
  const node = imageRef.current;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio >= 0.33) {
        setInView(true);
      }
    },
    { threshold: 0.33 }
  );

  if (node) {
    observer.observe(node);
  }

  return () => {
    if (node) {
      observer.unobserve(node);
    }
  };
}, []);
  return (
    <section className="bg-white relative overflow-hidden font-grotesk">
      <div className="max-w-7xl mx-auto px-6 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0047AB] mb-6 leading-tight">Buy and sell <br /> crypto with ease</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">Oceanic makes it simple to trade cryptocurrency securely and globally. Join us and start today!</p>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <input type="email" placeholder="Your e-mail" className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none w-full sm:w-64" />
            <button  className="bg-[#0047AB] text-white px-6 py-3 rounded-md hover:bg-[#0047AB]">
              <Link href={'/register'}>
                  Get Started
              </Link>
          
              </button>
          </div>
        </div>
        
        <div ref={imageRef} className="relative  ">
          <Image
            src={hero}
            alt="Phone Mockup"
            width={400}
            height={700}
            className={`mx-auto ${inView ? "animate-bounce-once" : ""}`}
          />

        </div>
      </div>
    </section>
  );
}

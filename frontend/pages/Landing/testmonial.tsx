"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import img from "../../public/Images/blogp.png";

const testimonials = [
  {
    id: 1,
    name: "Alice Carter",
    role: "Crypto Investor",
    image: img,
    text: "This platform has completely transformed the way I invest in crypto. The analytics and insights are top-notch!",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Blockchain Developer",
    image: img,
    text: "The security and transparency of this crypto project are outstanding. It's a game-changer for the industry!",
  },
  {
    id: 3,
    name: "Sophia Williams",
    role: "DeFi Enthusiast",
    image: img,
    text: "The seamless transactions and user-friendly interface make this my go-to crypto platform!",
  },
  {
    id: 4,
    name: "James Lee",
    role: "NFT Collector",
    image: img,
    text: "I found exclusive drops and community insights here. Awesome ecosystem!",
  },
  {
    id: 5,
    name: "Elena Garcia",
    role: "Crypto Trader",
    image: img,
    text: "Finally, a platform that respects speed and clarity. I love the clean UI.",
  },
  {
    id: 6,
    name: "Daniel Kim",
    role: "Web3 Builder",
    image: img,
    text: "I onboarded in minutes. The tech stack is solid and reliable.",
  },
];

export default function TestimonialSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 3,
      spacing: 18,
      origin: "center", // ✅ replaces "centered: true"
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1,
          spacing: 13,
          origin: "center",
        },
      },
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="py-12 pb-20 text-center font-grotesk relative">
      <h2 className="lg:text-2xl text-md font-bold mb-6">What Our Users Say</h2>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Arrows */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeftIcon className="w-5 h-5 text-black" />
        </button>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`keen-slider__slide p-6 shadow-xl rounded-2xl relative transition duration-300 ${
                currentSlide === idx
                  ? "bg-[#0047AB] text-white scale-105"
                  : "bg-white"
              }`}
            >
              <FaQuoteLeft className="absolute top-4 left-4 text-gray-300 text-md" />
              <p className="text-md italic px-4">{testimonial.text}</p>
              <div className="mt-4 flex flex-col items-center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={20}
                  height={20}
                  className="w-16 h-16 rounded-full shadow-lg"
                />
                <h4 className="font-semibold text-sm mt-2">{testimonial.name}</h4>
                <p className="text-xs opacity-70">{testimonial.role}</p>
              </div>
              <FaQuoteRight className="absolute bottom-4 right-4 text-gray-300 text-md" />
            </div>
          ))}
        </div>

        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <ChevronRightIcon className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === idx ? "bg-[#0047AB]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

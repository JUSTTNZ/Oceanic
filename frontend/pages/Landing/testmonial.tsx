"use client";

import { motion, AnimatePresence, Variants, easeInOut } from "framer-motion";
import Image from "next/image";
import img from "../../public/Images/blogp.png";
import { useState, useEffect } from "react";

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
    name: "David Johnson",
    role: "NFT Collector",
    image: img,
    text: "The NFT marketplace integration is seamless. I've discovered amazing digital art through this platform!",
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "Crypto Trader",
    image: img,
    text: "The real-time market data and trading tools have significantly improved my trading performance.",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Crypto Analyst",
    image: img,
    text: "The depth of market analysis available here is unparalleled in the crypto space.",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(1);

  // Handle responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(
        (prev) => (prev + 1) % (testimonials.length - itemsPerPage + 1)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, itemsPerPage]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: easeInOut },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.6, ease: easeInOut },
    }),
  };

  // Get visible testimonials
  const visibleTestimonials = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <div className="py-16 pb-24 text-center font-grotesk overflow-hidden bg-gradient-to-b from-[#141428] via-[#1c1c3b] to-[#141428] text-white relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-12 relative z-10"
      >
        <h2 className="md:text-3xl text-2xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <p className="text-gray-300 text-md max-w-2xl mx-auto">
          Hear from our community of crypto enthusiasts and investors
        </p>
      </motion.div>

      <div
        className="relative max-w-7xl mx-auto px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-70 overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex justify-center gap-6"
            >
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 bg-gradient-to-b from-blue-800/70 to-blue-900/90 rounded-xl shadow-lg w-full max-w-sm mx-auto flex-shrink-0 border border-blue-700/30 hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <p className="text-gray-100 text-md px-4 mb-6 italic relative z-10">
                    “{testimonial.text}”
                  </p>
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400 shadow-md shadow-blue-500/30">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-md mt-3 text-blue-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: testimonials.length - itemsPerPage + 1 }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index
                    ? "bg-blue-500"
                    : "bg-gray-500 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial group ${index + 1}`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

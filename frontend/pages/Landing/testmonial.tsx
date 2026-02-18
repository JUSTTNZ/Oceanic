"use client";

import { motion, AnimatePresence, Variants, easeInOut } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import testimonialData from "../../lib/testimonials.json";

function getDailyTestimonials() {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const shuffled = [...testimonialData.testimonials].sort(() => {
    const x = Math.sin(seed++) * 10000;
    return (x - Math.floor(x)) - 0.5;
  });

  return shuffled.slice(0, 5);
}

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(1);
  const [testimonials, setTestimonials] = useState<typeof testimonialData.testimonials>([]);

  useEffect(() => {
    setTestimonials(getDailyTestimonials());
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerPage(1);
      else if (w < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;

    const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, itemsPerPage, testimonials.length]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: easeInOut },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.5, ease: easeInOut },
    }),
  };

  const visibleTestimonials = [];
  for (let i = 0; i < itemsPerPage && i < testimonials.length; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 md:py-20 pb-20 sm:pb-24 text-center font-grotesk overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-12 relative z-10"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-5">
          Hear from our community about Oceanic&apos;s lightning-fast transactions
        </p>
      </motion.div>

      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-80 sm:h-[22rem] md:h-96 overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex justify-center gap-3 sm:gap-4 md:gap-6 px-1"
            >
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/15 w-full max-w-[340px] mx-auto flex-shrink-0 transition-all duration-300 flex flex-col"
                >
                  <p className="text-gray-300 text-sm sm:text-base px-2 sm:px-3 mb-5 sm:mb-6 italic relative z-10 min-h-[100px] sm:min-h-[120px] flex-1">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="mt-auto flex flex-col items-center">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/15">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base mt-2.5 sm:mt-3 text-white">
                      {testimonial.name}
                    </h4>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {Array.from({
            length: Math.max(1, testimonials.length - itemsPerPage + 1)
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentIndex === index
                  ? "bg-[#3b82f6] w-5 sm:w-6"
                  : "bg-white/15 hover:bg-white/30 w-2 sm:w-2.5"
              }`}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

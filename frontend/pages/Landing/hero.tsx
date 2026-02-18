"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden font-grotesk py-20 sm:py-28 md:py-36 lg:py-44">
      {/* Floating gradient orbs — fixed position, no layout impact */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-[#0047AB]/15 rounded-full blur-[100px] sm:blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[#7c3aed]/12 rounded-full blur-[90px] sm:blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[45%] left-[45%] w-[200px] h-[200px] bg-[#3b82f6]/8 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
            Live trading on 100+ markets
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-5 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Trade Crypto with
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#0047AB] via-[#3b82f6] to-[#7c3aed] bg-clip-text text-transparent">
              Speed &amp; Confidence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Buy, sell, and swap over 100 cryptocurrencies instantly.
            Transparent pricing, ironclad security, zero surprises.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#0047AB] hover:bg-[#3b82f6] text-white px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-semibold transition-colors cursor-pointer shadow-lg shadow-[#0047AB]/25">
                Get Started
              </button>
            </Link>
            <Link href="/markets" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-semibold transition-all cursor-pointer">
                View Markets
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 font-grotesk">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0047AB] via-[#3b5998] to-[#7c3aed]" />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* Glow orb */}
          <div className="absolute -top-16 -right-16 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-white/60 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-7 sm:mb-8 md:mb-10 px-2">
              Join thousands of traders already using Oceanic Charts.
              Create your free account and start trading in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-[#0047AB] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-semibold transition-colors cursor-pointer shadow-lg">
                  Get Started Free
                </button>
              </Link>
              <Link href="/markets" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-semibold transition-all cursor-pointer">
                  Explore Markets
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  UserPlusIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: UserPlusIcon,
    title: "Create Account",
    desc: "Sign up in under 2 minutes with just your email. Quick verification gets you trading-ready.",
    step: "01",
  },
  {
    icon: WalletIcon,
    title: "Fund Wallet",
    desc: "Deposit crypto or fiat using multiple payment methods. Instant deposits, no hidden fees.",
    step: "02",
  },
  {
    icon: ArrowTrendingUpIcon,
    title: "Start Trading",
    desc: "Buy, sell, and swap 100+ cryptocurrencies with lightning-fast execution and real-time data.",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 md:py-28 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-[#0047AB] to-[#7c3aed] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-2">
            Get started in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden sm:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#0047AB]/30 via-[#3b82f6]/30 to-[#7c3aed]/30 -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              viewport={{ once: true, amount: 0.15 }}
              className="relative z-10 group rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-7 md:p-8 text-center hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300"
            >
              {/* Large faded step number */}
              <div className="absolute top-3 right-4 sm:top-4 sm:right-5 text-6xl sm:text-7xl md:text-8xl font-bold text-white/[0.03] select-none pointer-events-none leading-none">
                {step.step}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:bg-[#0047AB]/20 transition-colors">
                <step.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 text-[#3b82f6]" />
              </div>

              {/* Step number badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4">
                Step {step.step}
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

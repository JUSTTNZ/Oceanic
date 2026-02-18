"use client";

import { motion } from "framer-motion";
import {
  BoltIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: BoltIcon,
    title: "Lightning-Fast Transactions",
    desc: "Execute trades in milliseconds. Our high-performance engine ensures you never miss a market opportunity.",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    icon: LockClosedIcon,
    title: "Ironclad Security",
    desc: "Your assets are protected with enterprise-grade encryption and multi-layer security protocols.",
    span: "",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Diverse Portfolio",
    desc: "Access 100+ cryptocurrencies from mainstream coins to emerging tokens.",
    span: "",
  },
  {
    icon: ChartBarIcon,
    title: "Advanced Analytics",
    desc: "Professional-grade charting tools and real-time market insights to inform every trade decision.",
    span: "",
  },
  {
    icon: GlobeAltIcon,
    title: "Global Access",
    desc: "Trade from anywhere in the world with support for multiple currencies and payment methods.",
    span: "",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "24/7 Expert Support",
    desc: "Our dedicated team is always available. Get help when you need it, day or night, via live chat and email.",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default function WhyOceanic() {
  return (
    <section className="py-16 sm:py-20 md:py-28 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#0047AB] to-[#7c3aed] bg-clip-text text-transparent">
              Oceanic?
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            We simplify the complexities of crypto trading with top-tier security, blazing speed, and seamless experience.
          </p>
        </motion.div>

        {/* Bento Grid: asymmetric — row 1: span-2 + 1, row 2: 1+1+1, row 3: 1 + span-2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true, amount: 0.15 }}
              className={`group relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 md:p-8 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15 hover:shadow-lg hover:shadow-[#0047AB]/5 ${feature.span}`}
            >
              {/* Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#0047AB]/20 transition-colors">
                <feature.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-[#3b82f6]" />
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";
import Head from "next/head";
import { useState } from "react";
import {
  RocketLaunchIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const faqs = [
  { question: "Do I need an account?", answer: "No. Oceanic Instant Swap is non-custodial and does not require registration or KYC." },
  { question: "What tokens can I swap?", answer: "You'll be able to swap supported tokens on ETH, BSC, Polygon, and more." },
  { question: "Is there a minimum or max swap limit?", answer: "Yes. Each pair has its own min/max based on liquidity." },
  { question: "Is the rate guaranteed?", answer: "Yes — we lock your rate for a short window before executing." },
  { question: "Will this feature be available globally?", answer: "Yes. Since it's wallet-based, it's globally accessible with no geo-blocking." },
];

export default function InstantSwapPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Instant Swap | Oceanic Charts</title>
        <meta name="description" content="Oceanic Instant Swap makes crypto-to-crypto conversion seamless. No slippage. No order books. Just one click, real-time swaps." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-12 space-y-16 sm:space-y-20 font-grotesk">
        {/* Hero */}
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center">
            <RocketLaunchIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Instant Crypto Swap</h1>
          <p className="text-base sm:text-lg text-gray-400">
            Real-time swaps without delays, order books, or confusion. Just pick a token, confirm the rate, and execute. Fast, secure, and radically simple.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {([
            [ArrowsRightLeftIcon, "Swap in One Tap", "No charts or order books. Just tap to convert."],
            [ClockIcon, "Near-Instant Speed", "Average execution time: <7 seconds."],
            [CurrencyDollarIcon, "Live Rates & Fee Clarity", "See fees and conversion rates before you confirm."],
            [ShieldCheckIcon, "Secure & Audited", "Built with fully audited smart contracts and no custodial risk."],
            [GlobeAltIcon, "Global & Accessible", "Supports multi-chain assets — available worldwide."],
          ] as [React.ElementType, string, string][]).map(([Icon, title, desc], idx) => (
            <div key={idx} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
              <Icon className="h-7 w-7 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-2">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">FAQs</h2>
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <div key={index} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFAQ(index)}>
                  <h3 className="text-base font-medium text-white flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />
                    {item.question}
                  </h3>
                  {openIndex === index ? <MinusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" /> : <PlusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />}
                </div>
                {openIndex === index && <p className="mt-3 text-gray-400 text-sm pl-7">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

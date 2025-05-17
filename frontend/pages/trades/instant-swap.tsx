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

const faqs = [
  {
    question: "Do I need an account?",
    answer: "No. Oceanic Instant Swap is non-custodial and does not require registration or KYC.",
  },
  {
    question: "What tokens can I swap?",
    answer: "You'll be able to swap supported tokens on ETH, BSC, Polygon, and more.",
  },
  {
    question: "Is there a minimum or max swap limit?",
    answer: "Yes. Each pair has its own min/max based on liquidity.",
  },
  {
    question: "Is the rate guaranteed?",
    answer: "Yes — we lock your rate for a short window before executing.",
  },
  {
    question: "Will this feature be available globally?",
    answer: "Yes. Since it's wallet-based, it's globally accessible with no geo-blocking.",
  },
];

export default function InstantSwapPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Instant Swap | Oceanic Charts</title>
        <meta
          name="description"
          content="Oceanic Instant Swap makes crypto-to-crypto conversion seamless. No slippage. No order books. Just one click, real-time swaps."
        />
      </Head>

      <section className="bg-white px-6 md:px-20 py-12 space-y-20 text-gray-900">
        {/* Hero */}
        <div className="text-left max-w-4xl mx-auto space-y-5">
          <RocketLaunchIcon className="h-12 w-12 text-[#0047AB]" />
          <h1 className="text-5xl font-bold">Instant Crypto Swap</h1>
          <p className="text-lg text-gray-700">
            Real-time swaps without delays, order books, or confusion. Just pick a token, confirm the rate, and execute. Fast, secure,
            and radically simple.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            [ArrowsRightLeftIcon, "Swap in One Tap", "No charts or order books. Just tap to convert."],
            [ClockIcon, "Near-Instant Speed", "Average execution time: <7 seconds."],
            [CurrencyDollarIcon, "Live Rates & Fee Clarity", "See fees and conversion rates before you confirm."],
            [ShieldCheckIcon, "Secure & Audited", "Built with fully audited smart contracts and no custodial risk."],
            [GlobeAltIcon, "Global & Accessible", "Supports multi-chain assets — available worldwide."],
          ].map(([Icon, title, desc], idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <Icon className="h-8 w-8 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs (Dropdown) */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 transition-all"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#0047AB]" />
                    {item.question}
                  </h3>
                  {openIndex === index ? (
                    <MinusIcon className="h-5 w-5 text-[#0047AB]" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-[#0047AB]" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="mt-3 text-gray-600 text-sm">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

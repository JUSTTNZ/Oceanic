"use client";
import Head from "next/head";
import { useState } from "react";
import {
  CurrencyYenIcon,
  LockClosedIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const testimonials = [
  {
    id: 1,
    name: "Sarah O.",
    feedback:
      "The buy process was super smooth. I topped up with NGN and got my BTC in less than 2 minutes!",
  },
  {
    id: 2,
    name: "Kenneth T.",
    feedback:
      "Selling my crypto on Oceanic was faster than I expected. Funds hit my bank in real-time. Highly recommend.",
  },
  {
    id: 3,
    name: "Fatima B.",
    feedback:
      "What impressed me was the rate transparency — no hidden charges and very fast KYC.",
  },
];

export default function BuySellPage() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      <Head>
        <title>Buy & Sell Crypto | Oceanic Charts</title>
        <meta
          name="description"
          content="Buy and sell cryptocurrency instantly using local currencies. Oceanic Charts provides fast, secure, and transparent crypto conversion."
        />
      </Head>

      <section className="px-6 md:px-20 py-14 space-y-24 text-gray-900 bg-white">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <CurrencyYenIcon className="h-16 w-16 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Buy & Sell Crypto Instantly</h1>
          <p className="text-lg text-gray-700">
            Whether you’re entering or exiting crypto — we make it lightning fast. Buy using fiat, sell to your bank, and track
            everything in one dashboard.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {([
            [ArrowDownTrayIcon, "Buy Crypto", "Use NGN, USD, or other local currencies to instantly buy USDT, BTC, ETH, and more."],
            [ArrowUpTrayIcon, "Sell Crypto", "Withdraw crypto and receive funds directly to your verified bank account."],
            [LockClosedIcon, "KYC Verified", "Seamless identity verification for faster approvals and compliance."],
            [CheckBadgeIcon, "Real-Time Settlement", "Crypto and fiat are both delivered instantly after confirmation."],
            [ShieldCheckIcon, "Secure Engine", "End-to-end encryption, 2FA, and fraud monitoring keep every transaction safe."],
            [UserGroupIcon, "Community Support", "We’re here with 24/7 live chat and email assistance if you need help."],
          ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]).map(([Icon, title, desc], i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <Icon className="h-8 w-8 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Slider Section */}
        <div className="bg-[#0047AB]/10 py-12 rounded-xl max-w-4xl mx-auto relative">
          <h2 className="text-2xl font-bold text-center mb-6">What Our Users Say</h2>

          <div className="px-6">
            <p className="text-lg text-center italic text-gray-700 min-h-[120px]">
              “{testimonials[index].feedback}”
            </p>
            <p className="text-right text-sm text-gray-600 mt-4">
              — {testimonials[index].name}
            </p>
          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 cursor-pointer" onClick={prevSlide}>
            <ChevronLeftIcon className="h-8 w-8 text-[#0047AB]" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer" onClick={nextSlide}>
            <ChevronRightIcon className="h-8 w-8 text-[#0047AB]" />
          </div>
        </div>

        {/* Summary Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Fast. Local. Secure.</h2>
          <p className="text-gray-700">
            Oceanic Charts bridges the gap between crypto and local currencies. With our Buy & Sell feature, you can convert in either
            direction — without long wait times or confusing interfaces.
          </p>
          <p className="text-gray-700">
            Our fiat onramp and offramp service supports fast settlement, local bank integration, and unbeatable transparency. Crypto in. Fiat
            out. Or vice versa. It just works.
          </p>
        </div>
      </section>
    </>
  );
}

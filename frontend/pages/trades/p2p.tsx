"use client";
import Head from "next/head";
import { useState } from "react";
import {
  UsersIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  MinusIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const faqs = [
  { question: "What is P2P trading?", answer: "P2P (Peer-to-Peer) trading lets you buy or sell crypto directly with other users. Oceanic provides the platform and escrow to make it safe." },
  { question: "How will escrow work?", answer: "When a trade starts, the crypto is locked in escrow. Once the buyer confirms payment, Oceanic releases the funds to the seller." },
  { question: "When is this launching?", answer: "We're currently finalizing compliance and liquidity routes. Launch is expected soon. Stay tuned!" },
  { question: "Will it support my country?", answer: "Yes, Oceanic P2P will be accessible globally with specific focus on emerging markets like Nigeria, Ghana, Kenya, India, and Brazil." },
];

export default function P2PPage() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Peer-to-Peer Marketplace | Oceanic Charts</title>
        <meta name="description" content="Oceanic's P2P crypto trading platform is coming soon. Trade directly with users securely using escrow, real-time chat, and trusted buyer/seller ranks." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-14 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <UsersIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Oceanic P2P Marketplace</h1>
          <p className="text-base sm:text-lg text-gray-400">
            Trade crypto directly with other users in your region using secure escrow. Our peer-to-peer platform is built for fairness, safety, and speed.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 sm:p-8 max-w-2xl mx-auto text-center">
          <ExclamationCircleIcon className="h-10 w-10 text-amber-400 mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-1">Coming Soon</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We're putting the final touches on our secure P2P engine and seller protection layer. Hang tight — Oceanic P2P is launching soon!
          </p>
        </div>

        {/* Core Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {([
            [ArrowPathIcon, "Escrow System", "Buyers and sellers are protected during every transaction."],
            [ShieldCheckIcon, "Dispute Resolution", "Oceanic support steps in to settle disputes fairly and fast."],
            [ClockIcon, "Live Chat During Trades", "Communicate directly with your buyer/seller in real-time."],
          ] as [React.ElementType, string, string][]).map(([Icon, title, desc], i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
              <Icon className="h-7 w-7 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
              <p className="text-gray-400 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">FAQs</h2>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(i)}>
                  <h3 className="text-base font-medium text-white flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />
                    {item.question}
                  </h3>
                  {open === i ? <MinusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" /> : <PlusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />}
                </div>
                {open === i && <p className="mt-3 text-gray-400 text-sm pl-7">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

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

const faqs = [
  {
    question: "What is P2P trading?",
    answer:
      "P2P (Peer-to-Peer) trading lets you buy or sell crypto directly with other users. Oceanic provides the platform and escrow to make it safe.",
  },
  {
    question: "How will escrow work?",
    answer:
      "When a trade starts, the crypto is locked in escrow. Once the buyer confirms payment, Oceanic releases the funds to the seller.",
  },
  {
    question: "When is this launching?",
    answer:
      "We’re currently finalizing compliance and liquidity routes. Launch is expected soon. Stay tuned!",
  },
  {
    question: "Will it support my country?",
    answer:
      "Yes, Oceanic P2P will be accessible globally with specific focus on emerging markets like Nigeria, Ghana, Kenya, India, and Brazil.",
  },
];

export default function P2PPage() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <>
      <Head>
        <title>Peer-to-Peer Marketplace | Oceanic Charts</title>
        <meta
          name="description"
          content="Oceanic's P2P crypto trading platform is coming soon. Trade directly with users securely using escrow, real-time chat, and trusted buyer/seller ranks."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-14 space-y-24">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <UsersIcon className="h-16 w-16 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Oceanic P2P Marketplace</h1>
          <p className="text-lg text-gray-600">
            Trade crypto directly with other users in your region using secure escrow. Our peer-to-peer platform is built for fairness,
            safety, and speed.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-8 max-w-2xl mx-auto text-center">
          <ExclamationCircleIcon className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-yellow-800 mb-1">Coming Soon</h2>
          <p className="text-gray-800">
            We’re putting the final touches on our secure P2P engine and seller protection layer. Hang tight — Oceanic P2P is launching soon!
          </p>
        </div>

        {/* Core Features (for preview) */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {( [
            [ArrowPathIcon, "Escrow System", "Buyers and sellers are protected during every transaction."],
            [ShieldCheckIcon, "Dispute Resolution", "Oceanic support steps in to settle disputes fairly and fast."],
            [ClockIcon, "Live Chat During Trades", "Communicate directly with your buyer/seller in real-time."],
          ] as [React.ElementType, string, string][] ).map(([Icon, title, desc], i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl space-y-2 shadow hover:shadow-md transition">
              <Icon className="h-8 w-8 text-[#0047AB]" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(i)}>
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#0047AB]" />
                    {item.question}
                  </h3>
                  {open === i ? (
                    <MinusIcon className="h-5 w-5 text-[#0047AB]" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-[#0047AB]" />
                  )}
                </div>
                {open === i && <p className="mt-3 text-gray-600 text-sm">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

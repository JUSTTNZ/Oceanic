// pages/p2p.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function P2PPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen font-grotesk">
      <header className="bg-[#0047AB] text-white py-10 px-6 text-center">
        <h1 className="text-4xl font-bold">Peer-to-Peer (P2P) Trading</h1>
        <p className="mt-2 text-lg">Trade crypto securely with real users using Oceanic Charts P2P platform.</p>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-[#0047AB] mb-4">What is P2P Trading?</h2>
          <p>
            Peer-to-peer (P2P) trading allows users to directly buy and sell cryptocurrencies from each other without an intermediary. Oceanic Charts provides an escrow-protected platform that ensures safe, transparent, and efficient P2P transactions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#0047AB] mb-4">Why Choose Oceanic Charts?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure escrow system protects both buyers and sellers</li>
            <li>Fast settlement and release of funds</li>
            <li>24/7 customer support</li>
            <li>Global access with localized payment methods</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#0047AB] mb-4">How to Get Started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Sign in to your Oceanic Charts account</li>
            <li>Go to the P2P section</li>
            <li>Choose your preferred offer or create your own</li>
            <li>Confirm trade details and proceed with transaction</li>
          </ol>
        </div>
        <div className="text-center pt-6">
          <Link href="/register">
            <button className="bg-[#0047AB] text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Get Started with P2P</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";
import Head from "next/head";
import {
  UsersIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FaWhatsapp, FaTelegramPlane, FaDiscord } from "react-icons/fa";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const communityMembers = [
  { name: "CryptoCoach", title: "Pro Trader", country: "\ud83c\uddf3\ud83c\uddec Nigeria" },
  { name: "SashaDev", title: "Web3 Engineer", country: "\ud83c\uddec\ud83c\udde7 UK" },
  { name: "HananChain", title: "P2P Seller", country: "\ud83c\uddf0\ud83c\uddea Kenya" },
];

export default function CommunityPage() {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Community | Oceanic Charts</title>
        <meta name="description" content="Connect with other Oceanic users, traders, and builders. Join discussions, share insights, and grow together." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <UsersIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Join the Oceanic Community</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Be part of a vibrant space of traders, developers, and pioneers. Connect, learn, and grow with people like you.
          </p>
        </div>

        {/* Member Highlights */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-center text-white">Community Voices</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {communityMembers.map((user, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all text-center space-y-2">
                <UserCircleIcon className="h-10 w-10 text-[#3b82f6] mx-auto" />
                <h3 className="text-base sm:text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.title}</p>
                <span className="text-sm text-gray-500">{user.country}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Join Us On</h2>
          <p className="text-gray-400 text-sm">We hang out on these platforms daily:</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <a href="https://chat.whatsapp.com/dummy-whatsapp-link" target="_blank" rel="noopener"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/15 transition-colors text-sm">
              <FaWhatsapp /> WhatsApp Group
            </a>
            <a href="https://t.me/oceaniccharts" target="_blank" rel="noopener"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/15 transition-colors text-sm">
              <FaTelegramPlane /> Telegram Channel
            </a>
            <a href="https://discord.gg/oceaniccharts" target="_blank" rel="noopener"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/15 transition-colors text-sm">
              <FaDiscord /> Join Discord
            </a>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 sm:p-8 text-center space-y-4">
          <ExclamationCircleIcon className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300">Oceanic Forum Coming Soon</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We're building a dedicated forum and real-time support space for verified Oceanic users. Ask questions, share strategies, and get help from both the team and the community.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

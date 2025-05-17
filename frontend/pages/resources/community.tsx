// Enhanced community.tsx with WhatsApp, Telegram, and Discord links
"use client";
import Head from "next/head";
import {
  UsersIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FaWhatsapp, FaTelegramPlane, FaDiscord } from "react-icons/fa";

const communityMembers = [
  { name: "CryptoCoach", title: "Pro Trader", country: "\ud83c\uddf3\ud83c\uddec Nigeria" },
  { name: "SashaDev", title: "Web3 Engineer", country: "\ud83c\uddec\ud83c\udde7 UK" },
  { name: "HananChain", title: "P2P Seller", country: "\ud83c\uddf0\ud83c\uddea Kenya" },
];

export default function CommunityPage() {
  return (
    <>
      <Head>
        <title>Community | Oceanic Charts</title>
        <meta
          name="description"
          content="Connect with other Oceanic users, traders, and builders. Join discussions, share insights, and grow together."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-16 space-y-24">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <UsersIcon className="h-12 w-12 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Join the Oceanic Community</h1>
          <p className="text-gray-600 text-lg">
            Be part of a vibrant space of traders, developers, and pioneers. Connect, learn, and grow with people like you.
          </p>
        </div>

        {/* Member Highlights */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-center">\ud83c\udf0d Community Voices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {communityMembers.map((user, i) => (
              <div
                key={i}
                className="border rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow transition text-center space-y-2"
              >
                <UserCircleIcon className="h-10 w-10 text-[#0047AB] mx-auto" />
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.title}</p>
                <span className="text-sm text-gray-500">{user.country}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-semibold">\ud83d\ude80 Join Us On</h2>
          <p className="text-gray-600 text-sm">We hang out on these platforms daily:</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a
              href="https://chat.whatsapp.com/dummy-whatsapp-link"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-600 text-green-700 hover:bg-green-100"
            >
              <FaWhatsapp /> WhatsApp Group (+234 000 0000)
            </a>
            <a
              href="https://t.me/oceaniccharts"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-600 text-blue-700 hover:bg-blue-100"
            >
              <FaTelegramPlane /> Telegram Channel
            </a>
            <a
              href="https://discord.gg/oceaniccharts"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-600 text-indigo-700 hover:bg-indigo-100"
            >
              <FaDiscord /> Join Discord
            </a>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-300 p-8 rounded-xl text-center space-y-4 shadow">
          <ExclamationCircleIcon className="h-10 w-10 text-yellow-600 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-800">Oceanic Forum Coming Soon</h2>
          <p className="text-gray-800 text-sm">
            We’re building a dedicated forum and real-time support space for verified Oceanic users. Ask questions, share strategies,
            and get help from both the team and the community.
          </p>
        </div>
      </section>
    </>
  );
}

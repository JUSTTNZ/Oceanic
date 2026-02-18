"use client";
import Head from "next/head";
import {
  PlayCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const tags = ["All", "Beginner", "Intermediate", "Security", "Compliance"];

export default function TutorialsPage() {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Crypto Tutorials | Oceanic Charts</title>
        <meta name="description" content="Explore in-depth crypto tutorials from Oceanic. Learn how to buy, swap, and manage digital assets securely." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <PlayCircleIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Tutorial Library</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Learn everything from buying your first token to advanced Oceanic features. We're preparing high-quality guides and walkthroughs to help you master crypto.
          </p>
        </div>

        {/* Filter/Search Preview (Disabled) */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 opacity-50 pointer-events-none">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</h2>
            <div className="relative">
              <input disabled placeholder="Search tutorials..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500" />
              <MagnifyingGlassIcon className="h-5 w-5 absolute top-2 left-3 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 sm:p-10 text-center space-y-4">
          <ExclamationCircleIcon className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300">Tutorials Coming Soon</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We're actively building Oceanic Academy — a complete learning experience for beginners, traders, and developers. You'll soon find video tutorials, explainers, and walkthroughs right here.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

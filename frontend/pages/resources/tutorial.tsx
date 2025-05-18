"use client";
import Head from "next/head";
import {
  PlayCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";

const tags = ["All", "Beginner", "Intermediate", "Security", "Compliance"];

export default function TutorialsPage() {
  return (
    <>
      <Navbar />
      {/* Meta Tags */}
      <Head>
        <title>Crypto Tutorials | Oceanic Charts</title>
        <meta
          name="description"
          content="Explore in-depth crypto tutorials from Oceanic. Learn how to buy, swap, and manage digital assets securely."
        />
      </Head>

      <section className="px-6 md:px-20 py-16 bg-white text-gray-900 space-y-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center bg-[#0047AB]/10 rounded-full p-4">
            <PlayCircleIcon className="h-10 w-10 text-[#0047AB]" />
          </div>
          <h1 className="text-5xl font-bold">Tutorial Library</h1>
          <p className="text-gray-600 text-lg">
            Learn everything from buying your first token to advanced Oceanic features. We’re preparing high-quality guides and walkthroughs to help you master crypto.
          </p>
        </div>

        {/* Filter/Search Preview (Disabled) */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 opacity-50 pointer-events-none">
          <div className="bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase">Categories</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase">Search</h2>
            <div className="relative">
              <input
                disabled
                placeholder="Search tutorials..."
                className="w-full border border-gray-300 bg-white rounded-md pl-10 pr-4 py-2 text-sm"
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-3xl mx-auto bg-yellow-50 border border-yellow-300 rounded-xl p-10 text-center space-y-4 shadow">
          <ExclamationCircleIcon className="h-10 w-10 text-yellow-600 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-800">Tutorials Coming Soon</h2>
          <p className="text-gray-800">
            We’re actively building Oceanic Academy — a complete learning experience for beginners, traders, and developers. You’ll soon find video tutorials, explainers, and walkthroughs right here.
          </p>
        </div>
      </section>
    </>
  );
}

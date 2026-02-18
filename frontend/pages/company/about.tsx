"use client";
import Head from "next/head";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  UsersIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

export default function AboutPage() {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>About Us | Oceanic Charts</title>
        <meta name="description" content="Learn about Oceanic Charts mission, values, and the team building secure and accessible financial tools through blockchain." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <GlobeAltIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Building Trust for the Next Billion Users
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Oceanic Charts is on a mission to simplify access to digital finance for everyone.
            We believe in borderless money, transparent systems, and user-first innovation.
          </p>
        </div>

        {/* Our Mission */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 sm:gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 text-base sm:text-lg">
              To empower individuals globally with simple, fast, and secure crypto tools
              without the complexity of traditional financial systems.
            </p>
          </div>
          <div className="rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 p-6 flex items-center justify-center">
            <RocketLaunchIcon className="h-16 w-16 text-[#3b82f6]" />
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">Our Core Values</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheckIcon, title: "Security First", desc: "We prioritize protection, compliance, and trust above all." },
              { icon: BoltIcon, title: "Speed & Simplicity", desc: "We remove friction so users can do more with less effort." },
              { icon: UsersIcon, title: "Community-Driven", desc: "We listen to our users and build tools that serve their real-world needs." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
                <item.icon className="h-7 w-7 text-[#3b82f6] mb-3" />
                <h3 className="font-semibold text-base sm:text-lg text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Vision</h2>
          <p className="text-gray-400 text-base sm:text-lg">
            We imagine a world where anyone, regardless of country or currency,
            can access tools that unlock their financial future.
            Oceanic Charts is not just a platform; it is a financial movement.
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-3xl mx-auto text-center space-y-3 pt-6">
          <p className="italic text-gray-500 text-base sm:text-lg">
            &quot;The future of finance is not only digital, it is inclusive. We are just getting started.&quot;
          </p>
          <p className="text-gray-600 text-sm">Oceanic Charts Core Team</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

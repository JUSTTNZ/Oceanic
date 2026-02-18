"use client";
import Head from "next/head";
import {
  BriefcaseIcon,
  LightBulbIcon,
  UserGroupIcon,
  GlobeAltIcon,
  StarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

export default function CareersPage() {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Careers | Oceanic Charts</title>
        <meta name="description" content="We are hiring! Join Oceanic Charts to build the future of accessible crypto finance." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <BriefcaseIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Work With Us</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Oceanic Charts is more than a product. It is a mission.
            We are building tools that reshape the future of finance, and we are looking
            for curious, bold, and mission-driven people to join us.
          </p>
        </div>

        {/* Why Oceanic */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            { icon: LightBulbIcon, title: "Invent Fast", desc: "We empower you to take bold bets and execute ideas quickly." },
            { icon: UserGroupIcon, title: "People-First Culture", desc: "We value empathy, growth, and collaborative energy above all." },
            { icon: GlobeAltIcon, title: "Remote-First and Global", desc: "Join us from anywhere. We believe talent is borderless." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
              <item.icon className="h-7 w-7 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Roles */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 sm:p-8 text-center space-y-4">
          <ExclamationCircleIcon className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300">
            We are Preparing Our Hiring Portal
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Our careers portal is launching soon with engineering, design, marketing,
            and support roles.
            If you are passionate about crypto, fintech, or community building, we want to meet you.
          </p>
        </div>

        {/* Closing CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4 pt-6">
          <StarIcon className="h-8 w-8 text-[#3b82f6] mx-auto" />
          <h3 className="text-lg sm:text-xl font-semibold text-white">Your Dream Role Is Not Listed?</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            Send us a message anyway. We are always open to exceptional people.
            Reach out at{" "}
            <a href="#" className="text-[#3b82f6] hover:underline">
              careers@oceaniccharts.com
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

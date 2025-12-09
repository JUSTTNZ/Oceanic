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
    <>
      <Navbar />
      {/* Meta Tags */}
      <Head>
        <title>About Us | Oceanic Charts</title>
        <meta
          name="description"
          content="Learn about Oceanic Charts mission, values, and the team building secure and accessible financial tools through blockchain."
        />
      </Head>

      <section className="px-6 md:px-20 py-16 space-y-24 bg-white text-gray-900">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <GlobeAltIcon className="h-12 w-12 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">
            Building Trust for the Next Billion Users
          </h1>
          <p className="text-gray-600 text-lg">
            Oceanic Charts is on a mission to simplify access to digital finance for everyone. 
            We believe in borderless money, transparent systems, and user-first innovation.
          </p>
        </div>

        {/* Our Mission */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">
              To empower individuals globally with simple, fast, and secure crypto tools 
              without the complexity of traditional financial systems.
            </p>
          </div>
          <div className="bg-[#0047AB]/10 rounded-xl p-6">
            <RocketLaunchIcon className="h-16 w-16 text-[#0047AB] mx-auto" />
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto space-y-10">
          <h2 className="text-3xl font-bold text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Security First",
                desc: "We prioritize protection, compliance, and trust above all.",
              },
              {
                icon: BoltIcon,
                title: "Speed & Simplicity",
                desc: "We remove friction so users can do more with less effort.",
              },
              {
                icon: UsersIcon,
                title: "Community-Driven",
                desc: "We listen to our users and build tools that serve their real-world needs.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <item.icon className="h-8 w-8 text-[#0047AB] mb-3" />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-gray-700 text-lg">
            We imagine a world where anyone, regardless of country or currency, 
            can access tools that unlock their financial future. 
            Oceanic Charts is not just a platform; it is a financial movement.
          </p>
        </div>

        {/* CTA or Founder Note */}
        <div className="max-w-3xl mx-auto text-center space-y-4 pt-10">
          <p className="italic text-gray-600">
            “The future of finance is not only digital, it is inclusive. We are just getting started.”
          </p>
          <p className="text-gray-500 text-sm">Oceanic Charts Core Team</p>
        </div>
      </section>
      <Footer />
    </>
  );
}

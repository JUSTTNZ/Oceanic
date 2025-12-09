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
    <>
      <Navbar />
      <Head>
        <title>Careers | Oceanic Charts</title>
        <meta
          name="description"
          content="We are hiring! Join Oceanic Charts to build the future of accessible crypto finance. Explore open roles and grow your career with us."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-16 space-y-24">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <BriefcaseIcon className="h-12 w-12 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Work With Us</h1>
          <p className="text-gray-600 text-lg">
            Oceanic Charts is more than a product. It is a mission. 
            We are building tools that reshape the future of finance, and we are looking 
            for curious, bold, and mission-driven people to join us.
          </p>
        </div>

        {/* Why Oceanic Charts Section */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              icon: LightBulbIcon,
              title: "Invent Fast",
              desc: "We empower you to take bold bets and execute ideas quickly.",
            },
            {
              icon: UserGroupIcon,
              title: "People-First Culture",
              desc: "We value empathy, growth, and collaborative energy above all.",
            },
            {
              icon: GlobeAltIcon,
              title: "Remote-First and Global",
              desc: "Join us from anywhere. We believe talent is borderless.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <item.icon className="h-8 w-8 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Roles (Coming Soon) */}
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-300 rounded-xl p-8 text-center space-y-4 shadow">
          <ExclamationCircleIcon className="h-10 w-10 text-yellow-600 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-800">
            We are Preparing Our Hiring Portal
          </h2>
          <p className="text-gray-800 text-sm">
            Our careers portal is launching soon with engineering, design, marketing, 
            and support roles.  
            If you are passionate about crypto, fintech, or community building, we want to meet you.
          </p>
        </div>

        {/* Closing CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4 pt-10">
          <StarIcon className="h-8 w-8 text-[#0047AB] mx-auto" />
          <h3 className="text-xl font-semibold">Your Dream Role Is Not Listed?</h3>
          <p className="text-gray-600">
            Send us a message anyway. We are always open to exceptional people.  
            Reach out at{" "}
            <a href="#" className="text-[#0047AB] underline">
              careers@oceaniccharts.com
            </a>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

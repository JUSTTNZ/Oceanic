"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import users from '../../public/Images/users.png'
import phone from '../../public/Images/phone1.png'
import globe from '../../public/Images/globe.png'
export default function AboutPage() {
  return (
    <section className="bg-white py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left side */}
        <div className="space-y-6">
          <div className="bg-white shadow-lg p-6 rounded-md">
            <div className="flex justify-between items-start">
              <h2 className="text-4xl font-extrabold text-[#0047AB] mb-2">30,000+</h2>
              <ArrowTrendingUpIcon className="h-9 w-9 text-green-500" />
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Sales in April 2025 with 5 star ratings and happy clients.
            </p>
            <hr className="border-t-2 border-[#0047AB] my-2" />
            <div className="flex flex-col items-start gap-2 flex-wrap">
              <Image src={users} alt="users" width={160} height={160} />
            <Image src={users} alt="users" width={200} height={200} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Image src={phone} alt="product 1" width={150} height={150} className="rounded-md" />
            </div>
            <Image src={globe} alt="product 2" width={300} height={300} className="rounded-md" />
          </div>

          <div className="bg-white shadow p-4 rounded-md text-center">
            <h4 className="font-semibold text-black mb-2">Best ratings</h4>
            <div className="flex justify-center gap-2 text-2xl">
              <span>😡</span>
              <span>😟</span>
              <span>😐</span>
              <span>😜</span>
              <span className="text-5xl">😁</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-4 md:space-y-6">
          <p className="text-[#0047AB] uppercase tracking-wide font-semibold">A bit</p>
          <h2 className="text-5xl font-extrabold text-[#0B0B3B]">About Us</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          Oceanic Charts is a leading crypto trading platform, empowering users to trade, swap, and manage digital assets with ease. We provide cutting-edge tools, secure transactions, and a community-driven experience to help you thrive in the world of crypto.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0047AB] text-white px-8 py-4 rounded-md shadow hover:bg-[#f75d3f] font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

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
              Sales in July 2021 with 5 star ratings and happy clients.
            </p>
            <hr className="border-t-2 border-[#0047AB] my-2" />
            <div className="flex flex-col items-start gap-2 flex-wrap">
              <Image src="/images/users.png" alt="users" width={160} height={160} />
              <Image src="/images/users.png" alt="users" width={160} height={160} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Image src="/images/phone1.png" alt="product 1" width={150} height={150} className="rounded-md" />
            </div>
            <Image src="/images/globe.png" alt="product 2" width={300} height={300} className="rounded-md" />
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
            From the fine john he give of rich he. They age and draw mrs like.
            Improving end distrusts may instantly was household applauded.
            Why kept very ever home mrs. Considered sympathize ten uncommonly
            occasional assistance sufficient not.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0047AB] text-white px-6 py-3 rounded-md shadow hover:bg-[#0047AB]"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}

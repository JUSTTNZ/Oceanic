"use client";
import Head from "next/head";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  LockClosedIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import TestimonialCarousel from "../Landing/testmonial";
import Footer from "../Landing/footer";

export default function BuySellPage() {
  return (
    <>
      <Navbar />
      {/* Meta Tags */}
      <Head>
        <title>Buy & Sell Crypto | Oceanic Charts</title>
        <meta
          name="description"
          content="Buy and sell cryptocurrency instantly using local currencies. Oceanic Charts provides fast, secure, and transparent crypto conversion."
        />
      </Head>

      <section className="px-6 md:px-20 py-14 space-y-24 text-gray-900 bg-white">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <CurrencyDollarIcon className="h-16 w-16 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Buy & Sell Crypto Instantly</h1>
          <p className="text-lg text-gray-700">
            Whether you&apos;re entering or exiting crypto, we make it lightning fast. Buy using fiat, sell to your bank, and track
            everything in one dashboard.
          </p>
        </div>

        {/* Buy & Sell Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link href="/login">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-blue-200 hover:border-blue-400 group">
              <ArrowDownTrayIcon className="h-12 w-12 text-[#0047AB] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-3 text-[#0047AB]">Buy Crypto</h3>
              <p className="text-gray-700 mb-4">
                Use NGN to instantly buy USDT, BTC, ETH, and more. Lightning-fast transactions with competitive rates.
              </p>
              <span className="text-[#0047AB] font-semibold group-hover:underline">
                Get Started →
              </span>
            </div>
          </Link>

          <Link href="/login">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-green-200 hover:border-green-400 group">
              <ArrowUpTrayIcon className="h-12 w-12 text-green-700 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-3 text-green-700">Sell Crypto</h3>
              <p className="text-gray-700 mb-4">
                Withdraw crypto and receive funds directly to your bank account. Fast settlement, zero hassle.
              </p>
              <span className="text-green-700 font-semibold group-hover:underline">
                Get Started →
              </span>
            </div>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {([
            [CheckBadgeIcon, "Real-Time Settlement", "Crypto and fiat are both delivered instantly after confirmation. No waiting periods."],
            [ShieldCheckIcon, "Bank-Grade Security", "Advanced encryption, multi-layer authentication, and 24/7 fraud monitoring protect every transaction."],
            [LockClosedIcon, "Secure Infrastructure", "Your funds are protected by industry-leading security protocols and cold storage solutions."],
            [UserGroupIcon, "24/7 Support", "Our dedicated team is here with live chat and email assistance whenever you need help."],
            [CurrencyDollarIcon, "Best Rates", "Competitive pricing with transparent fees. No hidden charges, ever."],
            [CheckBadgeIcon, "Instant Processing", "Lightning-fast transaction processing ensures you never miss market opportunities."],
          ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]).map(([Icon, title, desc], i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
              <Icon className="h-8 w-8 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Fast. Local. Secure.</h2>
          <p className="text-gray-700">
            Oceanic Charts bridges the gap between crypto and local currencies. With our Buy & Sell feature, you can convert in either
            direction, without long wait times or confusing interfaces.
          </p>
          <p className="text-gray-700">
            Our fiat onramp and offramp service supports lightning-fast settlement, local bank integration, and unbeatable transparency. 
            Experience the speed that sets us apart. Crypto in. Fiat out. Or vice versa. It just works.
          </p>
          
          <div className="pt-6">
            <Link href="/login">
              <button className="bg-[#0047AB] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#003380] transition-colors shadow-lg hover:shadow-xl">
                Start Trading Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel Section */}
      <TestimonialCarousel />
      <Footer />
    </>
  );
}
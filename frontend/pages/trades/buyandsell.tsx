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
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Buy & Sell Crypto | Oceanic Charts</title>
        <meta
          name="description"
          content="Buy and sell cryptocurrency instantly using local currencies. Oceanic Charts provides fast, secure, and transparent crypto conversion."
        />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-14 space-y-20 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <CurrencyDollarIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Buy & Sell Crypto Instantly</h1>
          <p className="text-base sm:text-lg text-gray-400">
            Whether you&apos;re entering or exiting crypto, we make it lightning fast. Buy using fiat, sell to your bank, and track
            everything in one dashboard.
          </p>
        </div>

        {/* Buy & Sell Action Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <Link href="/login">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.07] hover:border-white/15 transition-all cursor-pointer group">
              <ArrowDownTrayIcon className="h-10 w-10 text-[#3b82f6] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Buy Crypto</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4">
                Use NGN to instantly buy USDT, BTC, ETH, and more. Lightning-fast transactions with competitive rates.
              </p>
              <span className="text-[#3b82f6] font-semibold group-hover:underline text-sm">
                Get Started &rarr;
              </span>
            </div>
          </Link>

          <Link href="/login">
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.07] hover:border-white/15 transition-all cursor-pointer group">
              <ArrowUpTrayIcon className="h-10 w-10 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Sell Crypto</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4">
                Withdraw crypto and receive funds directly to your bank account. Fast settlement, zero hassle.
              </p>
              <span className="text-green-400 font-semibold group-hover:underline text-sm">
                Get Started &rarr;
              </span>
            </div>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {([
            [CheckBadgeIcon, "Real-Time Settlement", "Crypto and fiat are both delivered instantly after confirmation. No waiting periods."],
            [ShieldCheckIcon, "Bank-Grade Security", "Advanced encryption, multi-layer authentication, and 24/7 fraud monitoring protect every transaction."],
            [LockClosedIcon, "Secure Infrastructure", "Your funds are protected by industry-leading security protocols and cold storage solutions."],
            [UserGroupIcon, "24/7 Support", "Our dedicated team is here with live chat and email assistance whenever you need help."],
            [CurrencyDollarIcon, "Best Rates", "Competitive pricing with transparent fees. No hidden charges, ever."],
            [CheckBadgeIcon, "Instant Processing", "Lightning-fast transaction processing ensures you never miss market opportunities."],
          ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]).map(([Icon, title, desc], i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
              <Icon className="h-7 w-7 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Fast. Local. Secure.</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Oceanic Charts bridges the gap between crypto and local currencies. With our Buy & Sell feature, you can convert in either
            direction, without long wait times or confusing interfaces.
          </p>
          <p className="text-gray-400 text-sm sm:text-base">
            Our fiat onramp and offramp service supports lightning-fast settlement, local bank integration, and unbeatable transparency.
            Experience the speed that sets us apart. Crypto in. Fiat out. Or vice versa. It just works.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <button className="bg-[#0047AB] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-[#3b82f6] transition-colors cursor-pointer">
                Start Trading Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <Footer />
    </div>
  );
}

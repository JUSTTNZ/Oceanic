"use client";
import Head from "next/head";
import { useState } from "react";
import {
  CreditCardIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  WalletIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const faqs = [
  { question: "When will the Oceanic Card launch?", answer: "We're targeting Q4 2025 for global launch, pending regulatory finalization and beta testing." },
  { question: "Will I need KYC to use the card?", answer: "Yes. For security and compliance reasons, basic identity verification will be required." },
  { question: "Is the card a credit or debit card?", answer: "It functions as a prepaid crypto-backed debit card, with real-time crypto-to-fiat conversion." },
  { question: "Can I use multiple cryptocurrencies?", answer: "Absolutely. You'll be able to select which token to spend or even auto-prioritize tokens." },
  { question: "Is this card available worldwide?", answer: "Oceanic Cards will be rolled out regionally, starting with North America, Europe, and select African countries." },
];

export default function CardsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Crypto Cards | Oceanic Charts</title>
        <meta name="description" content="Oceanic Crypto Cards – designed for fast, secure, and borderless crypto spending." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-12 space-y-16 sm:space-y-20 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <CreditCardIcon className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Oceanic Crypto Cards</h1>
          <p className="text-base sm:text-lg text-gray-400">
            A smart, secure way to bring your crypto to the real world. Built for seamless global spending, smart conversions, and full wallet control.
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {([
            [WalletIcon, "Connect Wallet", "Link your Oceanic wallet to your card in seconds."],
            [AdjustmentsHorizontalIcon, "Choose Token", "Decide which token will be used for transactions."],
            [ArrowPathIcon, "Auto Convert", "We convert your crypto to fiat at point-of-sale."],
            [CreditCardIcon, "Swipe or Tap", "Use it just like any debit card — worldwide."],
            [EyeIcon, "Track in Real-Time", "See every transaction instantly from your dashboard."],
            [LockClosedIcon, "Freeze or Resume", "Instantly control card access for added security."],
          ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]).map(([Icon, title, desc], idx) => (
            <div key={idx} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6 hover:bg-white/[0.07] transition-all">
              <Icon className="h-7 w-7 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">Why Choose Oceanic Cards?</h2>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {([
              [GlobeAltIcon, "Spend Globally", "Accepted at 60M+ merchants and ATMs worldwide."],
              [ShieldCheckIcon, "Security First", "Protected by encryption, PINs, and 2FA control."],
              [CurrencyDollarIcon, "Zero Monthly Fees", "Only pay when you spend. No hidden charges."],
              [DevicePhoneMobileIcon, "Mobile Access", "Manage everything from the Oceanic app."],
              [BuildingLibraryIcon, "Fully Regulated", "Compliant with global and local authorities."],
            ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]).map(([Icon, title, desc], i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="p-2.5 rounded-xl bg-[#0047AB]/10 border border-[#0047AB]/20 shrink-0">
                  <Icon className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-white">{title}</h4>
                  <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier Comparison Table */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-8 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Card Tier Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/[0.08]">
                  <th className="py-2 px-4">Feature</th>
                  <th className="py-2 px-4">Standard</th>
                  <th className="py-2 px-4">Pro</th>
                  <th className="py-2 px-4">Elite</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ["Daily Limit", "$1,000", "$5,000", "$100,000+"],
                  ["ATM Access", "\u2713", "\u2713", "\u2713"],
                  ["Priority Support", "\u2717", "\u2713", "\u2713"],
                  ["Metal Finish", "\u2717", "\u2717", "\u2713"],
                  ["Branding", "\u2717", "\u2713", "\u2713"],
                ].map(([feature, std, pro, elite], i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2.5 px-4 text-white">{feature}</td>
                    <td className="py-2.5 px-4">{std}</td>
                    <td className="py-2.5 px-4">{pro}</td>
                    <td className="py-2.5 px-4">{elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <div key={index} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFAQ(index)}>
                  <h3 className="text-base font-medium text-white flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />
                    {item.question}
                  </h3>
                  {openIndex === index ? <MinusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" /> : <PlusIcon className="h-5 w-5 text-[#3b82f6] shrink-0" />}
                </div>
                {openIndex === index && <p className="mt-3 text-gray-400 text-sm pl-7">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

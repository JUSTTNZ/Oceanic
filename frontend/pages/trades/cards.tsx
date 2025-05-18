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
const faqs = [
  {
    question: "When will the Oceanic Card launch?",
    answer: "We're targeting Q4 2025 for global launch, pending regulatory finalization and beta testing.",
  },
  {
    question: "Will I need KYC to use the card?",
    answer: "Yes. For security and compliance reasons, basic identity verification will be required.",
  },
  {
    question: "Is the card a credit or debit card?",
    answer: "It functions as a prepaid crypto-backed debit card, with real-time crypto-to-fiat conversion.",
  },
  {
    question: "Can I use multiple cryptocurrencies?",
    answer: "Absolutely. You'll be able to select which token to spend or even auto-prioritize tokens.",
  },
  {
    question: "Is this card available worldwide?",
    answer: "Oceanic Cards will be rolled out regionally, starting with North America, Europe, and select African countries.",
  },
];

export default function CardsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      {/* Meta Tags */}
      <Head>
        <title>Crypto Cards | Oceanic Charts</title>
        <meta
          name="description"
          content="Oceanic Crypto Cards – designed for fast, secure, and borderless crypto spending. Learn how our upcoming card solution transforms digital payments."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-12 space-y-20">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <CreditCardIcon className="h-16 w-16 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Oceanic Crypto Cards</h1>
          <p className="text-lg text-gray-700">
            A smart, secure way to bring your crypto to the real world. Oceanic Cards are built for seamless global spending,
            smart conversions, and full wallet control.
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {(
            [
              [WalletIcon, "Connect Wallet", "Link your Oceanic wallet to your card in seconds."],
              [AdjustmentsHorizontalIcon, "Choose Token", "Decide which token will be used for transactions."],
              [ArrowPathIcon, "Auto Convert", "We convert your crypto to fiat at point-of-sale."],
              [CreditCardIcon, "Swipe or Tap", "Use it just like any debit card — worldwide."],
              [EyeIcon, "Track in Real-Time", "See every transaction instantly from your dashboard."],
              [LockClosedIcon, "Freeze or Resume", "Instantly control card access for added security."],
            ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]
          ).map(([Icon, title, desc], idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow">
              <Icon className="h-8 w-8 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Why Choose Oceanic Cards?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(
              [
                [GlobeAltIcon, "Spend Globally", "Accepted at 60M+ merchants and ATMs worldwide."],
                [ShieldCheckIcon, "Security First", "Protected by encryption, PINs, and 2FA control."],
                [CurrencyDollarIcon, "Zero Monthly Fees", "Only pay when you spend. No hidden charges."],
                [DevicePhoneMobileIcon, "Mobile Access", "Manage everything from the Oceanic app."],
                [BuildingLibraryIcon, "Fully Regulated", "Compliant with global and local authorities."],
              ] as [React.ComponentType<React.SVGProps<SVGSVGElement>>, string, string][]
            ).map(([Icon, title, desc], i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="p-3 rounded-full bg-[#0047AB]/10">
                  <Icon className="h-7 w-7 text-[#0047AB]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{title}</h4>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier Comparison Table */}
        <div className="bg-gray-50 p-8 rounded-lg max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Card Tier Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 px-4">Feature</th>
                  <th className="py-2 px-4">Standard</th>
                  <th className="py-2 px-4">Pro</th>
                  <th className="py-2 px-4">Elite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily Limit", "$1,000", "$5,000", "$100,000+"],
                  ["ATM Access", "✓", "✓", "✓"],
                  ["Priority Support", "✗", "✓", "✓"],
                  ["Metal Finish", "✗", "✗", "✓"],
                  ["Branding", "✗", "✓", "✓"],
                ].map(([feature, std, pro, elite], i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 px-4">{feature}</td>
                    <td className="py-2 px-4">{std}</td>
                    <td className="py-2 px-4">{pro}</td>
                    <td className="py-2 px-4">{elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs with Dropdown */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#0047AB]" />
                    {item.question}
                  </h3>
                  {openIndex === index ? (
                    <MinusIcon className="h-5 w-5 text-[#0047AB]" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-[#0047AB]" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="mt-3 text-gray-600 text-sm">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

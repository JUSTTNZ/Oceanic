"use client";
import Head from "next/head";
import {
  CodeBracketIcon,
  ServerIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  CpuChipIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const docs = [
  { icon: CodeBracketIcon, title: "API Reference", description: "View full documentation for Oceanic's REST endpoints including authentication, requests, and responses." },
  { icon: KeyIcon, title: "Authentication", description: "Learn how to securely authenticate users and manage access tokens in your apps." },
  { icon: ServerIcon, title: "Webhooks", description: "Set up webhooks to receive real-time updates for buy/sell transactions, user actions, and system events." },
  { icon: CommandLineIcon, title: "CLI Tools", description: "Use our lightweight CLI to manage resources, run queries, and automate tasks directly from your terminal." },
  { icon: CpuChipIcon, title: "SDKs & Libraries", description: "Explore official Oceanic SDKs for JavaScript, Python, and mobile frameworks." },
];

export default function DocsPage() {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Developer Docs | Oceanic Charts</title>
        <meta name="description" content="Explore Oceanic's developer documentation, APIs, SDKs, CLI, and integrations." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-16 sm:space-y-24 font-grotesk">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center mx-auto">
            <CodeBracketIcon className="h-7 w-7 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Developer Documentation</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Build on Oceanic&apos;s APIs and developer tools. Access secure endpoints, manage keys, and connect seamlessly with our trading infrastructure.
          </p>
        </div>

        {/* Disabled Search */}
        <div className="relative max-w-xl mx-auto opacity-50 pointer-events-none">
          <input type="text" disabled placeholder="Search docs (coming soon)..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500" />
          <MagnifyingGlassIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-500" />
        </div>

        {/* Docs Grid Preview */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-6xl mx-auto opacity-60 pointer-events-none">
          {docs.map((doc, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 sm:p-6">
              <doc.icon className="h-6 w-6 text-[#3b82f6] mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{doc.title}</h3>
              <p className="text-sm text-gray-400">{doc.description}</p>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 sm:p-8 text-center space-y-4">
          <ExclamationCircleIcon className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300">Docs Coming Soon</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We&apos;re preparing a complete developer portal with guides, API references, authentication, and webhook integrations. Stay tuned — your toolbox is almost ready.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

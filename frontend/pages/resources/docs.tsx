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

const docs = [
  {
    icon: CodeBracketIcon,
    title: "API Reference",
    description: "View full documentation for Oceanic's REST endpoints including authentication, requests, and responses.",
  },
  {
    icon: KeyIcon,
    title: "Authentication",
    description: "Learn how to securely authenticate users and manage access tokens in your apps.",
  },
  {
    icon: ServerIcon,
    title: "Webhooks",
    description: "Set up webhooks to receive real-time updates for buy/sell transactions, user actions, and system events.",
  },
  {
    icon: CommandLineIcon,
    title: "CLI Tools",
    description: "Use our lightweight CLI to manage resources, run queries, and automate tasks directly from your terminal.",
  },
  {
    icon: CpuChipIcon,
    title: "SDKs & Libraries",
    description: "Explore official Oceanic SDKs for JavaScript, Python, and mobile frameworks.",
  },
];

export default function DocsPage() {
  return (
    <>
      <Head>
        <title>Developer Docs | Oceanic Charts</title>
        <meta
          name="description"
          content="Explore Oceanic’s developer documentation, APIs, SDKs, CLI, and integrations. Build faster with secure tools and real-time access."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-16 space-y-24">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <CodeBracketIcon className="h-12 w-12 text-[#0047AB] mx-auto" />
          <h1 className="text-5xl font-bold">Developer Documentation</h1>
          <p className="text-gray-600 text-lg">
            Build on Oceanic’s APIs and developer tools. Access secure endpoints, manage keys, and connect seamlessly with our trading infrastructure.
          </p>
        </div>

        {/* Disabled Search */}
        <div className="relative max-w-xl mx-auto opacity-50 pointer-events-none">
          <input
            type="text"
            disabled
            placeholder="Search docs (coming soon)..."
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm bg-white"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute top-2.5 left-3 text-gray-400" />
        </div>

        {/* Docs Grid Preview */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto opacity-60 pointer-events-none">
          {docs.map((doc, i) => (
            <div key={i} className="border rounded-lg p-6 bg-gray-50 hover:shadow transition">
              <doc.icon className="h-6 w-6 text-[#0047AB] mb-3" />
              <h3 className="text-lg font-semibold mb-1">{doc.title}</h3>
              <p className="text-sm text-gray-600">{doc.description}</p>
            </div>
          ))}
        </div>

        {/* Coming Soon Alert */}
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-300 p-8 rounded-xl text-center space-y-4 shadow">
          <ExclamationCircleIcon className="h-10 w-10 text-yellow-600 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-800">Docs Coming Soon</h2>
          <p className="text-gray-800">
            We're preparing a complete developer portal with guides, API references, authentication, and webhook integrations.
            Stay tuned — your toolbox is almost ready.
          </p>
        </div>
      </section>
    </>
  );
}

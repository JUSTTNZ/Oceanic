"use client";
import React from "react";
import Head from "next/head";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const BlogPage: React.FC = () => {
  return (
    <div className="landing-dark-bg min-h-screen">
      <Navbar />
      <Head>
        <title>Blog | Oceanic Charts</title>
        <meta name="description" content="Insights and updates from Oceanic Charts on financial inclusion, blockchain innovation, and the future of digital finance." />
      </Head>

      <section className="px-4 sm:px-6 md:px-20 py-16 space-y-12 font-grotesk">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Insights from the Oceanic Charts Team</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Stay informed about blockchain innovation, global finance adoption,
            and product advancements shaping the future of digital money.
          </p>
        </div>

        {/* Blog Placeholder */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-10 text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Our Blog is Coming Soon</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We are currently preparing insightful content focused on crypto finance, user empowerment,
            platform releases, and security best practices.
          </p>
          <p className="text-gray-400 text-sm sm:text-base">
            Check back soon for updates as we continue building financial access for everyone.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPage;

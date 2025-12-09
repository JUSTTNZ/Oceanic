"use client";
import React from "react";
import Head from "next/head";
import Navbar from "../Landing/navbar";
import Footer from "../Landing/footer";

const BlogPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Head>
        <title>Blog | Oceanic Charts</title>
        <meta
          name="description"
          content="Insights and updates from Oceanic Charts on financial inclusion, blockchain innovation, and the future of digital finance."
        />
      </Head>

      <section className="bg-white text-gray-900 px-6 md:px-20 py-16 space-y-12">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-5xl font-bold">Insights from the Oceanic Charts Team</h1>
          <p className="text-gray-600 text-lg">
            Stay informed about blockchain innovation, global finance adoption, 
            and product advancements shaping the future of digital money.
          </p>
        </div>

        {/* Blog Placeholder (Until CMS Integration) */}
        <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-10 text-center space-y-3 shadow">
          <h2 className="text-2xl font-bold text-gray-800">Our Blog is Coming Soon</h2>
          <p className="text-gray-600 text-sm">
            We are currently preparing insightful content focused on crypto finance, user empowerment, 
            platform releases, and security best practices.
          </p>
          <p className="text-gray-600 text-sm">
            Check back soon for updates as we continue building financial access for everyone.
          </p>
        </div>
      </section>
	  <Footer />
    </>
  );
};

export default BlogPage;

"use client";

import { useState } from "react";
import Image from "next/image";
import Img from "../../public/Images/blog.png";
import author from "../../public/Images/blogp.png"
import Footer from "../login/footer";
import Header from "../login/header";

export default function CryptoBlog() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Bitcoin Hits New All-Time High",
      excerpt: "Bitcoin surges past its previous record, reaching new heights in the crypto market.",
      date: "March 24, 2025",
      image: Img,
      author: "Satoshi Nakamoto",
      authorImage: author,
    },
    {
      id: 2,
      title: "Ethereum 2.0: What You Need to Know",
      excerpt: "Ethereum's latest upgrade is set to revolutionize blockchain technology.",
      date: "March 22, 2025",
      image: Img,
      author: "Vitalik Buterin",
      authorImage: author,
    },
    {
      id: 3,
      title: "Top 5 Altcoins to Watch This Year",
      excerpt: "Check out the most promising altcoins that could explode in 2025.",
      date: "March 20, 2025",
      image: Img,
      author: "Crypto Guru",
      authorImage: author,
    },
    {
        id: 4,
        title: "Bitcoin Hits New All-Time High",
        excerpt: "Bitcoin surges past its previous record, reaching new heights in the crypto market.",
        date: "March 24, 2025",
        image: Img,
        author: "Satoshi Nakamoto",
        authorImage: author,
      },
      {
        id: 5,
        title: "Ethereum 2.0: What You Need to Know",
        excerpt: "Ethereum's latest upgrade is set to revolutionize blockchain technology.",
        date: "March 22, 2025",
        image: Img,
        author: "Vitalik Buterin",
        authorImage: author,
      },
      {
        id: 6,
        title: "Top 5 Altcoins to Watch This Year",
        excerpt: "Check out the most promising altcoins that could explode in 2025.",
        date: "March 20, 2025",
        image: Img,
        author: "Crypto Guru",
        authorImage: author,
      },
  ]);

  const loadMorePosts = () => {
    // Simulate loading more posts 
    setPosts([
      ...posts,
      {
        id: posts.length + 1,
        title: "New Crypto Trends in 2025",
        excerpt: "A deep dive into the latest crypto market movements and trends.",
        date: "March 18, 2025",
        image: Img,
        author: "John Doe",
        authorImage: author,
      },
      {
        id: posts.length + 1,
        title: "New Crypto Trends in 2025",
        excerpt: "A deep dive into the latest crypto market movements and trends.",
        date: "March 18, 2025",
        image: Img,
        author: "John Doe",
        authorImage: author,
      },
      {
        id: posts.length + 1,
        title: "New Crypto Trends in 2025",
        excerpt: "A deep dive into the latest crypto market movements and trends.",
        date: "March 18, 2025",
        image: Img,
        author: "John Doe",
             authorImage: author,
      },
    ]);
  };

  return (
    <section>
        <Header />
        <div className="min-h-screen bg-[#f7f7fa] font-maven pt-20 pb-20 px-4">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl text-blue-900 font-bold">Crypto Blog</h1>
        <p className="text-blue-900 text-sm md:text-base">Latest news and updates in the crypto world</p>
      </header>

      <main className="lg:max-w-7xl p-4 mx-auto py-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-center md:text-left">Featured Articles</h2>

    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image src={post.image} alt={post.title} width={400} height={250} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-400">{post.title}</h3>
                  <p className="mt-2 text-gray-700 text-sm md:text-base">{post.excerpt}</p>

                  <div className="flex items-center gap-3 mt-4">
                    <Image src={post.authorImage} alt={post.author} width={40} height={40} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-semibold">{post.author}</p>
                      <p className="text-gray-500 text-xs">{post.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMorePosts}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition w-full sm:w-auto"
            >
              Load More
            </button>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </section>

  );
}

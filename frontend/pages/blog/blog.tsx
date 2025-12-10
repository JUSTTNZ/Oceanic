"use client";

import { useState, useEffect } from "react";
import SafeImage from "../components/safeImage"; 
import Img from "../../public/Images/blog.png";
import author from "../../public/Images/blogp.png";
import Footer from "../login/footer";
import Header from "../login/header";
import Link from "next/link";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  authorImage: string;
  link: string;
}

interface NewsApiResult {
  title: string;
  description?: string;
  pubDate: string;
  image_url?: string;
  source_id?: string;
  source_icon?: string;
  link: string;
}

export default function CryptoBlog() {
  const [posts, setPosts] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=pub_87223795e358ba915e269e1c15e6c3cfa49a6&q=cryptocurrency&language=en&category=business`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          throw new Error("No news data available");
        }

        setPosts(prevPosts => [
          ...prevPosts,
          ...data.results.map((item: NewsApiResult, index: number) => ({
            id: index + 1 + prevPosts.length,
            title: item.title,
            excerpt: item.description || "No description available",
            date: new Date(item.pubDate).toLocaleDateString(),
            image: item.image_url || (Img as unknown as string),
            author: item.source_id || "Unknown Source",
            authorImage: item.source_icon || (author as unknown as string),
            link: item.link,
          })),
        ]);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("API Error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMorePosts = () => {
    if (!loading) setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <section>
        <Header />
        <div className="min-h-screen bg-gray-900 font-maven pt-20 lg:pt-30 pb-20 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section>
      <Header />
      <div className="min-h-screen bg-gray-900 font-maven pt-20 lg:pt-30 pb-20 px-4">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-bold">
            Crypto Blog
          </h1>
          <p className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-sm md:text-base">
            Latest news and updates in the crypto world
          </p>
        </header>

        <main className="lg:max-w-7xl p-4 mx-auto py-8 lg:px-20 md:px-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent text-center md:text-left">
              Featured Articles
            </h2>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg overflow-hidden bg-gray-800/30 border border-gray-700/20 rounded-xl text-white hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10"
                >
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-400">
                      <Link href={post.link} legacyBehavior>
                        <a target="_blank">{post.title}</a>
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-100 text-sm md:text-base">
                      {post.excerpt.split(" ").slice(0, 20).join(" ")}
                      {post.excerpt.split(" ").length > 20 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <SafeImage
                        src={post.authorImage}
                        alt={post.author}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold">{post.author}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 transition-all hover:shadow-lg hover:shadow-blue-500/20 rounded-lg font-semibold w-full sm:w-auto"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </section>
  );
}

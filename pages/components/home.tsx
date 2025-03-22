"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { Line } from "react-chartjs-2";
import {
  ChevronDownIcon,
  CreditCardIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  Squares2X2Icon,
  UsersIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {

  type Coin = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    sparkline_in_7d: {
      price: number[];
    };
  };

  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchAllCoins = async (pageNumber = 1) => {
    const res = await fetch(`/api/coin?page=${pageNumber}`); 
    const data = await res.json();
    return data;
  };
  

  useEffect(() => {
    const getCoins = async () => {
      const fetchedData = await fetchAllCoins();
      setCoins(fetchedData);
    }
    getCoins();
  }, [])

  const loadCoins = async (pageNumber: number) => {
    setLoading(true);
    const data = await fetchAllCoins(pageNumber);
    setCoins(data);
    setLoading(false);
  };

  // Initial load and auto-refresh every 60 seconds
  useEffect(() => {
    loadCoins(page);
    const interval = setInterval(() => loadCoins(page), 60000); // 60s
    return () => clearInterval(interval);
  }, [page]);

  // Filter coins based on search
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const megaMenus = {
    Products: [
      {
        icon: CreditCardIcon,
        title: "Cards",
        desc: "Spend your money globally with a card that does it all",
      },
      {
        icon: RocketLaunchIcon,
        title: "Instant Swap",
        desc: "Buy your favourite cryptocurrency in 2 mins or less.",
      },
      {
        icon: LockClosedIcon,
        title: "Orderbook",
        desc: "Access diverse markets with supercharged liquidity.",
      },
      {
        icon: Squares2X2Icon,
        title: "Launchpad",
        desc: "Launch new and existing tokens on Oceanic with ease",
      },
    ],
    Resources: [
      {
        icon: UsersIcon,
        title: "Community",
        desc: "Join our growing crypto community",
      },
      {
        icon: RocketLaunchIcon,
        title: "Tutorials",
        desc: "Learn to trade with our easy guides",
      },
      {
        icon: BookOpenIcon,
        title: "Docs",
        desc: "Read the technical documentation",
      },
    ],
    Company: [
      {
        icon: BriefcaseIcon,
        title: "About Us",
        desc: "Get to know Oceanic Charts",
      },
      {
        icon: BookOpenIcon,
        title: "Careers",
        desc: "Join our fast-growing team",
      },
      {
        icon: RocketLaunchIcon,
        title: "Blog",
        desc: "Latest updates and insights",
      },
    ],
  };

  return (
    <div className="bg-white text-black relative z-50">
      <div className="flex justify-between items-center px-6 py-6 font-bold relative  ">
        {/* Logo */}
        <h1 className="text-5xl">
          Oceanic <span className="text-[#0047AB]">Charts</span>
        </h1>

        {/* Nav */}
        <nav className="hidden md:flex text-xl space-x-12 font-semibold relative z-50">
          {Object.keys(megaMenus).map((menu) => (
            <div
              key={menu}
              onMouseEnter={() => setHoverItem(menu)}
              onMouseLeave={() => setHoverItem(null)}
              className="relative"
            >
              <p className={`flex items-center cursor-pointer ${hoverItem === menu ? "text-[#0047AB]" : ""}`}>
                {menu}
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                    hoverItem === menu ? "rotate-180 text-[#0047AB]" : ""
                  }`}
                />
              </p>

              {/* Mega Dropdown */}
              {hoverItem === menu && (
                <div
                  className="absolute left-0 top-[120%] w-[calc(100vw-1200px)] bg-white border-t border-gray-200 px-10 py-10 shadow-xl flex flex-wrap gap-8 transition-all duration-300 animate-fade-in"
                  onMouseEnter={() => setHoverItem(menu)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  {megaMenus[menu].map((item, idx) => (
                    <div key={idx} className="flex-1 min-w-[200px] group cursor-pointer">
                      <item.icon className="h-10 w-10 text-[#0047AB] mb-3" />
                      <h3 className="text-lg font-semibold group-hover:text-[#0047AB]">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                  <div className="flex flex-col justify-end">
                    <Link href="/all">
                      <p className="text-[#0047AB] font-semibold hover:underline">See All {menu}</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex space-x-8 items-center">
          <p className="text-[#0047AB] text-lg cursor-pointer">Sign in</p>
          <p className="text-white bg-[#0047AB] px-6 py-2 text-lg rounded-md hover:bg-[#459af5] cursor-pointer">
            Get Started
          </p>
        </div>

        {/* Mobile Toggle Placeholder */}
        <div className="md:hidden">
          <p>☰</p>
        </div>
      </div>


      <section className="bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0047AB] mb-6 leading-tight">
            Buy and sell <br /> crypto with ease
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Oceanic makes it simple to trade cryptocurrency securely and globally. Join us and start today!
          </p>
          <div className="flex space-x-4">
            <input
              type="email"
              placeholder="Your e-mail"
              className="border border-gray-300 px-4 py-3 rounded-md focus:outline-none w-64"
            />
            <button className="bg-[#0047AB] text-white px-6 py-3 rounded-md hover:bg-[#0b5ce9]">
              Get Started
            </button>
          </div>

          {/* App Store Badges */}
          {/* <div className="flex space-x-4 mt-6">
            <Image src="/appstore-badge.png" alt="App Store" width={150} height={48} />
            <Image src="/playstore-badge.png" alt="Google Play" width={150} height={48} />
          </div> */}
        </div>

        {/* Phone Mockup */}
        <div className="relative">
          <Image src="/Images/hero.webp" alt="Phone Mockup" width={400} height={700} className="mx-auto" />
          {/* Floating 3D shapes */}
          {/* <div className="absolute top-0 left-0">
            <Image src="/abstract-blue-shape.png" alt="shape" width={64} height={64} className="animate-float" />
          </div>
          <div className="absolute bottom-0 right-0">
            <Image src="/abstract-ring.png" alt="ring" width={96} height={96} className="animate-spin-slow" />
          </div> */}
        </div>
      </div>
    </section>

    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0047AB]">Popular Cryptocurrencies</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-[#0047AB]"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoins.map((coin) => {
            const trendUp = coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] >= coin.sparkline_in_7d.price[0];

            return (
              <div key={coin.id} className="p-4 border rounded-lg shadow-md bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Image 
                    src={coin.image} 
                    alt={coin.name} 
                    width={32} // Set an appropriate width
                    height={32} // Set an appropriate height 
                    className="w-6 h-6" />
                    <h2 className="font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${trendUp ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {trendUp ? '▲' : '▼'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">${coin.current_price.toFixed(2)}</h3>

                <Line
                  data={{
                    labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
                    datasets: [{
                      data: coin.sparkline_in_7d.price,
                      borderColor: trendUp ? 'green' : 'red',
                      fill: false,
                      tension: 0.1
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } }
                  }}
                  height={100}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-[#0047AB] text-white rounded-md disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-[#0047AB] text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
    </div>

    
  );
}

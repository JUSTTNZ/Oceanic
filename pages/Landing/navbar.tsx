// /src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
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
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  const megaMenus = {
    Products: [
      { icon: CreditCardIcon, title: "Cards", desc: "Spend globally." },
      { icon: RocketLaunchIcon, title: "Instant Swap", desc: "Swap fast." },
      { icon: LockClosedIcon, title: "Orderbook", desc: "Deep liquidity." },
      { icon: Squares2X2Icon, title: "Launchpad", desc: "Launch tokens." },
    ],
    Resources: [
      { icon: UsersIcon, title: "Community", desc: "Join community." },
      { icon: RocketLaunchIcon, title: "Tutorials", desc: "Easy guides." },
      { icon: BookOpenIcon, title: "Docs", desc: "Technical docs." },
    ],
    Company: [
      { icon: BriefcaseIcon, title: "About Us", desc: "About Oceanic." },
      { icon: BookOpenIcon, title: "Careers", desc: "Work with us." },
      { icon: RocketLaunchIcon, title: "Blog", desc: "Read updates." },
    ],
  };

  return (
    <header className="bg-white text-black relative z-50">
      <div className="flex justify-between items-center px-6 py-6 font-bold">
        <h1 className="text-5xl">Oceanic <span className="text-[#007BFF]">Charts</span></h1>
        <nav className="hidden md:flex text-xl space-x-12 font-semibold">
          {Object.keys(megaMenus).map((menu) => (
            <div key={menu} onMouseEnter={() => setHoverItem(menu)} onMouseLeave={() => setHoverItem(null)} className="relative">
              <p className={`flex items-center cursor-pointer ${hoverItem === menu ? "text-[#007BFF]" : ""}`}>
                {menu}
                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${hoverItem === menu ? "rotate-180 text-[#007BFF]" : ""}`} />
              </p>
              {hoverItem === menu && (
                <div className="absolute left-0 top-[120%] bg-white border-t px-8 py-6 shadow-xl flex gap-8">
                  {megaMenus[menu].map((item, idx) => (
                    <div key={idx} className="flex-1 min-w-[150px] group cursor-pointer">
                      <item.icon className="h-8 w-8 text-[#007BFF] mb-2" />
                      <h3 className="text-lg font-semibold group-hover:text-[#007BFF]">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                  <div className="flex flex-col justify-end">
                    <Link href="/all"><p className="text-[#007BFF] font-semibold hover:underline">See All {menu}</p></Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden md:flex space-x-8 items-center">
          <p className="text-[#007BFF] text-lg cursor-pointer">Sign in</p>
          <p className="text-white bg-[#007BFF] px-6 py-2 text-lg rounded-md hover:bg-[#459af5] cursor-pointer">Get Started</p>
        </div>
        <div className="md:hidden">
          <p>☰</p>
        </div>
      </div>
    </header>
  );
}
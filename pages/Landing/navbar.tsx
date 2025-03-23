"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
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
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

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

  const toggleSection = (menu: string) => {
    setOpenSection(openSection === menu ? null : menu);
  };

  return (
    <header className="bg-white text-black relative z-50">
      <div className="flex justify-between items-center px-6 py-6 font-bold">
        <h1 className={` text-3xl md:text-4l `}>Oceanic <span className="text-[#0047AB]">Charts</span></h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex text-xl space-x-12 font-semibold">
          {Object.keys(megaMenus).map((menu) => (
            <div key={menu} onMouseEnter={() => setHoverItem(menu)} onMouseLeave={() => setHoverItem(null)} className="relative">
              <p className={`flex items-center cursor-pointer ${hoverItem === menu ? "text-[#0047AB]" : ""}`}>
                {menu}
                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${hoverItem === menu ? "rotate-180 text-[#0047AB]" : ""}`} />
              </p>
              {hoverItem === menu && (
                <div className="absolute left-0 top-[130%] bg-white rounded-md px-8 py-6 shadow-xl flex gap-8">
                  {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                    <div key={idx} className="flex-1 min-w-[150px] group cursor-pointer">
                      <item.icon className="h-8 w-8 text-[#0047AB] mb-2" />
                      <h3 className="text-lg font-semibold group-hover:text-[#0047AB]">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                  <div className="flex flex-col justify-end">
                    <Link href="/all"><p className="text-[#0047AB] font-semibold hover:underline">See All {menu}</p></Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden md:flex space-x-8 items-center">
          <p className="text-[#0047AB] text-lg cursor-pointer">Sign in</p>
          <p className="text-white bg-[#0047AB] px-6 py-2 text-lg rounded-md hover:bg-[#459af5] cursor-pointer">Get Started</p>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="space-y-1">
            <span className={`block h-[3px] w-7 bg-black transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`}></span>
            <span className={`block h-[3px] w-5 bg-black mx-auto transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`block h-[3px] w-7 bg-black transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}></span>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 space-y-6">
          {Object.keys(megaMenus).map((menu) => (
            <div key={menu}>
              <div onClick={() => toggleSection(menu)} className="flex justify-between items-center cursor-pointer py-2 font-semibold">
                <span className={openSection === menu ? "text-[#0047AB]" : ""}>{menu}</span>
                {openSection === menu ? (
                  <ChevronUpIcon className="w-4 h-4 text-[#0047AB]" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                )}
              </div>
              {openSection === menu && (
                <div className="space-y-4 font-thin pl-4 py-2 bg-gray-50 rounded">
                  {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-700 hover:text-[#0047AB] cursor-pointer">{item.title}</p>
                  ))}
                  <p className="text-[#0047AB] font-semibold text-sm cursor-pointer mt-2">See All {menu}</p>
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 space-y-3">
            <p className="text-black font-semibold">Sign In</p>
            <button className="bg-[#0047AB] w-full py-3 rounded text-white font-bold">Get Started</button>
          </div>
        </div>
      )}
    </header>
  );
}

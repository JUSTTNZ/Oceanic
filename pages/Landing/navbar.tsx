"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Trade: [
      { icon: CreditCardIcon, title: "Cards", desc: "Spend money globally with a card that does it all." },
      { icon: RocketLaunchIcon, title: "Instant Swap", desc: "Buy your favourite cryptocurrency in 2 mins or less." },
      { icon: LockClosedIcon, title: "Buy/Sell", desc: "Trade cryptocurrencies instantly with deep liquidity and competitive rates." },
      { icon: Squares2X2Icon, title: "P2P", desc: "Securely buy and sell crypto directly with other users." },
    ],
    Resources: [
      { icon: UsersIcon, title: "Community", desc: "Connect with other traders and stay updated on the latest trends." },
      { icon: RocketLaunchIcon, title: "Tutorials", desc: "Step-by-step guides to help you navigate crypto trading with ease." },
      { icon: BookOpenIcon, title: "Docs", desc: "Comprehensive technical documentation for developers and traders." },
    ],
    Company: [
      { icon: BriefcaseIcon, title: "About Us", desc: "Learn more about Oceanic and our mission to revolutionize trading." },
      { icon: BookOpenIcon, title: "Careers", desc: "Join our team and build a future in the world of crypto and finance." },
      { icon: RocketLaunchIcon, title: "Blog", desc: "Stay informed with the latest news, insights, and market trends." },
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
            <div
              key={menu}
              onMouseEnter={() => setHoverItem(menu)}
              onMouseLeave={() => setHoverItem(null)}
              className="relative"
            >
              <p className={`flex items-center cursor-pointer ${hoverItem === menu ? "text-[#0047AB]" : ""}`}>
                {menu}
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${hoverItem === menu ? "rotate-180 text-[#0047AB]" : ""}`}
                />
              </p>

              {/* Animated Dropdown */}
              <AnimatePresence>
                {hoverItem === menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 right-0 shadow-xl z-10"
                  >
                    <div className="max-w-screen-xl mx-auto w-full bg-white rounded-md px-8 py-6 flex gap-4 pt-20">
                      <div className="grid grid-cols-4 gap-16 w-full pt-10 pb-5">
                        {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                          >
                            <Link href="../sell">
                              <item.icon className="h-10 w-10 text-[#0047AB] mb-4" />
                            </Link>
                            <Link href="../sell">
                              <h3 className="text-lg font-semibold group-hover:text-[#0047AB] mb-3">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden md:flex space-x-8 items-center">
          <p className="text-[#0047AB] text-lg cursor-pointer">Sign in</p>
          <p className="text-white bg-[#0047AB] px-6 py-2 text-lg rounded-md hover:bg-[#459af5] cursor-pointer z-20">Get Started</p>
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-6 pb-6 space-y-6"
          >
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
                <AnimatePresence>
                  {openSection === menu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 font-thin pl-4 py-2 bg-gray-50 rounded"
                    >
                      {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700 hover:text-[#0047AB] cursor-pointer">{item.title}</p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

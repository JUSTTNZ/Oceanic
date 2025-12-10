"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { megaMenus } from "../../lib/navLinks";

export default function Navbar() {
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (menu: string) => {
    setOpenSection(openSection === menu ? null : menu);
  };

  return (
    <header className="bg-white text-black relative z-50 font-grotesk">
      <div className="flex justify-between items-center px-6 py-6 font-bold">
        <h1 className={` text-2xl md:text-4l `}>Oceanic <span className="text-[#0047AB]">Charts</span></h1>

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
                    className="fixed left-0 right-0 shadow-xl z-10"
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
                            <Link href={item.href}>
                              <item.icon className="h-10 w-10 text-[#0047AB] mb-4" />
                              <h3 className="text-lg font-semibold group-hover:text-[#0047AB] mb-3">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </Link>
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
          <Link href={"/login"}>
            <button className="text-[#0047AB] text-lg cursor-pointer">Sign in</button>
          </Link>
          <Link href="/register">
            <button className="text-white bg-[#0047AB] px-6 py-2 text-lg rounded-md hover:bg-[#459af5] cursor-pointer z-20">Get Started</button>
          </Link>
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
                      className="space-y-3 font-thin pl-4 py-3 bg-gray-50 rounded"
                    >
                      {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                        <Link key={idx} href={item.href}>
                          <p className="text-sm text-gray-700 hover:text-[#0047AB] active:text-[#0047AB] cursor-pointer py-1.5 px-2 rounded transition-all duration-200 hover:bg-blue-50 active:bg-blue-100 hover:translate-x-1">
                            {item.title}
                          </p>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div className="pt-4 space-y-4">
              <Link href="/login">
                <button className="w-full text-[#0047AB] text-lg border mb-4 border-[#0047AB] py-2 rounded-md">
                  Sign in
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full bg-[#0047AB] text-white text-lg py-2 rounded-md hover:bg-[#459af5]">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
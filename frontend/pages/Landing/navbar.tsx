"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { megaMenus } from "../../lib/navLinks";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMenuEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleSection = (menu: string) => {
    setOpenSection(openSection === menu ? null : menu);
  };

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setIsOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 font-grotesk">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        <Link href="/">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
            Oceanic <span className="text-[#3b82f6]">Charts</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex text-sm xl:text-base space-x-6 xl:space-x-8 font-semibold">
          {Object.keys(megaMenus).map((menu) => (
            <div
              key={menu}
              onMouseEnter={() => handleMenuEnter(menu)}
              onMouseLeave={handleMenuLeave}
              className="relative"
            >
              <p className={`flex items-center cursor-pointer py-2 transition-colors duration-200 ${
                activeMenu === menu ? "text-[#3b82f6]" : "text-gray-300 hover:text-white"
              }`}>
                {menu}
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
                    activeMenu === menu ? "rotate-180" : ""
                  }`}
                />
              </p>

              {/* Dropdown — no gap, connects directly below the trigger */}
              <AnimatePresence>
                {activeMenu === menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    onMouseEnter={() => handleMenuEnter(menu)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className="bg-[#0f0f24]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/40 min-w-[280px]">
                      <div className="space-y-1">
                        {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                          <Link key={idx} href={item.href}>
                            <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-150 cursor-pointer">
                              <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#0047AB]/10 border border-[#0047AB]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0047AB]/20 transition-colors">
                                <item.icon className="h-4.5 w-4.5 text-[#3b82f6]" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          </Link>
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
        <div className="hidden lg:flex space-x-3 items-center">
          <Link href="/login">
            <button className="text-gray-300 hover:text-white text-sm cursor-pointer transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
              Sign in
            </button>
          </Link>
          <Link href="/register">
            <button className="text-white bg-[#0047AB] hover:bg-[#3b82f6] px-5 py-2.5 text-sm rounded-xl cursor-pointer transition-colors font-semibold">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden cursor-pointer p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-center items-center w-6 h-5 relative">
            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 absolute ${isOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"}`} />
            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 absolute top-1/2 -translate-y-1/2 ${isOpen ? "opacity-0 scale-0" : ""}`} />
            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 absolute ${isOpen ? "-rotate-45 top-1/2 -translate-y-1/2" : "bottom-0"}`} />
          </div>
        </button>
      </div>

      {/* Mobile Collapsible Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-[#0a0a1a]/98 backdrop-blur-xl"
          >
            <div className="px-5 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {Object.keys(megaMenus).map((menu) => (
                <div key={menu} className="border-b border-white/5 last:border-0">
                  <button
                    onClick={() => toggleSection(menu)}
                    className="flex justify-between items-center w-full cursor-pointer py-3 font-semibold text-left"
                  >
                    <span className={`transition-colors text-base ${openSection === menu ? "text-[#3b82f6]" : "text-gray-300"}`}>
                      {menu}
                    </span>
                    {openSection === menu ? (
                      <ChevronUpIcon className="w-4 h-4 text-[#3b82f6]" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openSection === menu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 space-y-1">
                          {megaMenus[menu as keyof typeof megaMenus].map((item, idx) => (
                            <Link key={idx} href={item.href} onClick={() => setIsOpen(false)}>
                              <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors">
                                <item.icon className="w-4 h-4 text-[#3b82f6] shrink-0" />
                                <span className="text-sm text-gray-400 hover:text-white transition-colors">
                                  {item.title}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="pt-3 space-y-2.5">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full text-gray-300 text-sm border border-white/15 py-2.5 rounded-xl hover:bg-white/5 transition-colors mb-2">
                    Sign in
                  </button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-[#0047AB] text-white text-sm py-2.5 rounded-xl hover:bg-[#3b82f6] transition-colors font-semibold">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

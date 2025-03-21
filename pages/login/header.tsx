"use client";
import { useState } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-500 text-white p-3 flex justify-between items-center px-8 z-50 shadow-md font-poppins">
      <h1 className="text-xl font-bold">Oceanic</h1>

   
      <nav className="hidden lg:flex gap-6">
        <ul className="flex gap-6 pt-2">
          <li>
            <Link
              href="#"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              OCC Token
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Instant Swap
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Order Book
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Sign In
            </Link>
          </li>
        </ul>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transition-transform duration-300">
          Create Account
        </button>
      </nav>

  
      <button
        className="lg:hidden transition-transform duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <RiMenu3Line className="w-6 h-6" />
      </button>

   
      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />
    </header>
  );
}

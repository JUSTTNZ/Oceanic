"use client";

import Link from "next/link";
import { LiaTimesSolid } from "react-icons/lia";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  return (
    <>
 
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-lg font-bold">Oceanic</h2>
          <button
            onClick={closeSidebar}
            className="transition-opacity duration-300 hover:opacity-70"
          >
            <LiaTimesSolid className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4">
          <Link
            href="#"
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
          >
            OCC Token
          </Link>
          <Link
            href="#"
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
          >
            Instant Swap
          </Link>
          <Link
            href="#"
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
          >
            Order Book
          </Link>
          <Link
            href="#"
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
          >
            Sign In
          </Link>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transition-transform duration-300 ">
            Create Account
          </button>
        </nav>
      </div>

 
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
}

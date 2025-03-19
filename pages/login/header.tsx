"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-500 text-white p-3 flex justify-between items-center px-8 z-50 shadow-md">
      <h1 className="text-xl font-bold">Quidax</h1>

      {/* Desktop Nav (Hidden on small screens) */}
      <nav className="hidden md:flex gap-6">
        <a href="#" className="hover:underline pt-2">QDX Token</a>
        <a href="#" className="hover:underline pt-2">Instant Swap</a>
        <a href="#" className="hover:underline pt-2">Order Book</a>
        <a href="#" className="hover:underline pt-2">Sign In</a>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
          Create Account
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(true)}>
        <HiOutlineMenuAlt4  className="w-6 h-6" />
      </button>

      {/* Sidebar (Mobile Navigation) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-600 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4">
          <a href="#" className="hover:underline">QDX Token</a>
          <a href="#" className="hover:underline">Instant Swap</a>
          <a href="#" className="hover:underline">Order Book</a>
          <a href="#" className="hover:underline">Sign In</a>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
            Create Account
          </button>
        </nav>
      </div>

      {/* Overlay (closes sidebar when clicked) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </header>
  );
}

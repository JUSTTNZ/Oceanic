"use client";

import Link from "next/link";
import { LiaTimesSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface RootState {
  user: {
    uid: number;
    email: string;
    username: string;
    roles: string;
  };
}

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const user = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${
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
            href="/markets"
            onClick={closeSidebar}
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300"
          >
            Markets
          </Link>
          <Link
            href="/swap"
            onClick={closeSidebar}
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300"
          >
            Instant Swap
          </Link>
          <Link
            href="/blog"
            onClick={closeSidebar}
            className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300"
          >
            Blog
          </Link>

          {user && (
            <Link
              href="/trade"
              onClick={closeSidebar}
              className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300"
            >
              Trade
            </Link>
          )}

          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between bg-blue-600 px-3 py-2 rounded"
              >
                O{user.username}
                <FaChevronDown size={12} className="ml-2" />
              </button>

              {isDropdownOpen && (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/profile"
                    onClick={closeSidebar}
                    className="px-4 py-2 rounded hover:bg-blue-400"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/transaction"
                    onClick={closeSidebar}
                    className="px-4 py-2 rounded hover:bg-blue-400"
                  >
                    Transaction History
                  </Link>
                  <Link
                    href="/support"
                    onClick={closeSidebar}
                    className="px-4 py-2 rounded hover:bg-blue-400"
                  >
                    Support
                  </Link>
                  <Link
                    href="#"
                    onClick={closeSidebar}
                    className="px-4 py-2 rounded hover:bg-blue-400"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeSidebar}
                className="hover:bg-blue-400 px-3 py-2 rounded transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link href="/register" onClick={closeSidebar}>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transition-transform duration-300 w-full mt-2">
                  Create Account
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}

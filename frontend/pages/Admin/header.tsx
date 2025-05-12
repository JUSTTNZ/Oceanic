"use client";
import { useState } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";

interface RootState {
  user: {
    uid: number;
    email: string;
    username: string;
    roles: string;
  };
}
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleSignOut = async () => {
  
  };
  
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
  };
  const user = useSelector((state: RootState) => state.user);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white p-3 flex justify-between items-center px-4 sm:px-8 z-50 shadow-md font-grotesk">
      <h1 className="text-xl font-bold">Oceanic</h1>

  
      <nav className="hidden lg:flex gap-6">
        <ul className="flex gap-6 pt-2"> 
          <li>
            <button className="relative p-2 rounded-full hover:bg-gray-800/30 transition-colors backdrop-blur-sm">
              <FaBell className="text-gray-300" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-xs flex items-center justify-center rounded-full backdrop-blur-sm">
                {4}
              </span>
            </button>
          </li>
        </ul>
        {user ? (
          <>
            <button 
              id="dropdownDefaultButton" 
              data-dropdown-toggle="dropdown" 
              className="text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-grotesk rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-300" 
              type="button"
              onClick={toggleDropdown}
            >
              {user.username}
              <FaChevronDown size={12} className="ms-3" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button className="bg-gradient-to-r from-white to-gray-100 text-blue-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <Link href={'/register'}>
                Create Account
              </Link>
            </button>
          </>
        )}
        {isDropDownOpen && (
          <div 
            id="dropdown" 
            className="z-10 absolute top-14 right-4 mt-2 bg-gradient-to-b from-blue-600 to-blue-700 text-white divide-y divide-blue-400 rounded-md shadow-sm w-44"
          >
            <ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
              <li>
                <Link href="/profile" className="block px-4 py-3 hover:bg-blue-500/50 transition-colors">My Account</Link>
              </li>
              <li>
                <Link href="/transaction" className="block px-4 py-3 hover:bg-blue-500/50 transition-colors">Activity History</Link>
              </li>
              <li onClick={() => setShowModal(true)}>
                <Link href="#" className="block px-4 py-3 hover:bg-blue-500/50 transition-colors">Sign out</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      
 
      <div className="flex lg:hidden items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-800/30 transition-colors backdrop-blur-sm">
          <FaBell className="text-gray-300 text-lg" />
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-xs flex items-center justify-center rounded-full backdrop-blur-sm">
            {4}
          </span>
        </button>
  
        <button
          className="p-2 rounded-full hover:bg-gray-800/30 transition-colors backdrop-blur-sm"
          onClick={() => setIsOpen(true)}
        >
          <RiMenu3Line className="w-6 h-6" />
        </button>
      </div>

      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gradient-to-b from-white to-gray-100 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
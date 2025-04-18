"use client";
import { useState } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";
import {  FaChevronDown } from "react-icons/fa";
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

  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
    };
    const user = useSelector((state: RootState) => state.user);

  return (
    
    <header className="fixed top-0 left-0 w-full bg-blue-400 text-white p-3 flex justify-between items-center px-8 z-50 shadow-md font-grotesk">
      <h1 className="text-xl font-bold">Oceanic</h1>

   
      <nav className="hidden lg:flex gap-6">
        <ul className="flex gap-6 pt-2"> 
          <li>
            <Link
              href="markets"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Markets
            </Link>
          </li>
          <li>
          
          {user && (
        
       
        <li>
        <Link
          href="/trade"
          className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
        >
          Trade
        </Link>
      </li>
      )}
          </li>
          <li>
            <Link
              href="/blog"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Blog
            </Link>
          </li>
      
        </ul>
        {user ? (
        <>
        <button 
          id="dropdownDefaultButton" 
          data-dropdown-toggle="dropdown" 
          className="text-white bg-[#0047AB]  text-grotesk rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center custom-class" 
          type="button"
          onClick={toggleDropdown}
        >
          O{user.username}
          <FaChevronDown size={12} className=" ms-3" aria-hidden="true" />
        </button>

                    </>


          ):(

            <>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transition-transform duration-300">
              <Link href={'/register'}>
            
                      Create Account
                      </Link>
                    </button>
            </>
        )}
       {isDropDownOpen && (
        <div 
          id="dropdown" 
                  className="z-10 absolute top-14 right-4 mt-2 bg-blue-500 text-white divide-y divide-gray-100 rounded-md shadow-sm w-44 "
        >
          <ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
            <li>
              <Link href="/profile" className="block px-4 py-3 hover:bg-blue-400  ">My Account</Link>
            </li>
            <li>
              <Link href="/transaction" className="block px-4 py-3 hover:bg-blue-400 ">Transaction History</Link>
            </li>
            <li>
              <Link href="/support" className="block px-4 py-3 hover:bg-blue-400 ">Support</Link>
            </li>
            <li>
              <Link href="#" className="block px-4 py-3 hover:bg-blue-400 ">Sign out</Link>
            </li>
          </ul>
        </div>
        )}
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

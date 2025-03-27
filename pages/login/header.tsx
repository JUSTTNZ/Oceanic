"use client";
import { useState } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";
import {  FaChevronDown } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState(true)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
    };
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
         {!user ? (
           <li>
           <Link
             href="#"
             className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
           >
             Sign In
           </Link>
         </li>
          ):(
            <li>
            <Link
              href="#"
              className="hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300 ease-in-out"
            >
              Wallet
            </Link>
          </li>
         )}
        </ul>
        {!user ? (


<>
<button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold transition-transform duration-300">
          Create Account
        </button>
</>
          ):(

            <>
<button 
  id="dropdownDefaultButton" 
  data-dropdown-toggle="dropdown" 
  className="text-white bg-blue-400  font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center custom-class" 
  type="button"
  onClick={toggleDropdown}
>
  Odominic
  <FaChevronDown size={12} className=" ms-3" aria-hidden="true" />
</button>
{isDropDownOpen && (
<div 
  id="dropdown" 
          className="z-10 absolute top-14 right-4 mt-2 bg-blue-500 text-white divide-y divide-gray-100 rounded-md shadow-sm w-44 "
>
  <ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
    <li>
      <a href="#" className="block px-4 py-3 hover:bg-blue-400  ">My Account</a>
    </li>
    <li>
      <a href="#" className="block px-4 py-3 hover:bg-blue-400 ">Transaction History</a>
    </li>
    <li>
      <a href="#" className="block px-4 py-3 hover:bg-blue-400 ">Support</a>
    </li>
    <li>
      <a href="#" className="block px-4 py-3 hover:bg-blue-400 ">Sign out</a>
    </li>
  </ul>
</div>
)}
            </>
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

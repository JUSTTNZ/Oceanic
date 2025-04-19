"use client";
import { useState } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";
import {  FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { persistor } from "@/store";
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
  const dispatch = useDispatch()
  const router = useRouter()
  const handleSignOut = async () => {
    try {
      // const response = await fetch('http://localhost:7001//api/v1/users/logout', {
      //   method: 'POST',
      //   credentials: 'include', // Required for sending cookies
      // });
  
      // const contentType = response.headers.get('Content-Type');
      // if (contentType && contentType.includes('application/json')) {
      //   const data = await response.json();
      //   console.log("Logout success:", data);
      // } else {
      //   throw new Error("Expected JSON, but got something else.");
      // }
  
      // Clear Redux state and persist store
      dispatch({ type: "SET_USER", payload: '' });
      persistor.purge(); // clear persisted data
  
      setShowModal(false);
      router.push('/login'); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
 
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
          {user.username}
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
            <li   onClick={() => setShowModal(true)}>
              <Link href="#" className="block px-4 py-3 hover:bg-blue-400 ">Sign out</Link>
            </li>

            {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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

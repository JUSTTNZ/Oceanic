"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import Sidebar from "./sidebar";
import { RiMenu3Line } from "react-icons/ri";
import {  FaChevronDown, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { clearUser } from "@/action";
import { apiClients } from "@/lib/apiClient";
import { supabase } from "@/lib/supabase";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // Get Supabase session for authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.warn('No Supabase session found');
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notifications/unread/count`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.data?.unreadCount || 0);
        } else {
          console.error('Failed to fetch unread count:', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    fetchUnreadCount();

    // Poll for new notifications every 15 seconds
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Call logout endpoint (clears cookies server-side)
      const response = await apiClients.request(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/logout`,
        {
          method: 'POST',
          credentials: 'include', // Required for cookies!
        }
      );

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // 2. Clear client-side state
      dispatch(clearUser()); // Redux
    

      // 3. Redirect to login
      router.push('/login');
      toast.success('Logged out successfully');

    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };
 
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
    };
    const user = useSelector((state: RootState) => state.user);

  return (
    
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white p-3 flex justify-between items-center px-4 sm:px-8 z-50 shadow-md font-grotesk">
      <h1 className="text-lg md:text-3xl font-grotesk font-bold">Oceanic Charts</h1>

   
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
        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative flex items-center hover:bg-blue-300 px-3 py-2 rounded transition-colors duration-300"
          title="Notifications"
        >
          <FaBell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <button 
          id="dropdownDefaultButton" 
          data-dropdown-toggle="dropdown" 
              className="text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-grotesk rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-300" 
          type="button"
          onClick={toggleDropdown}
        >
          {user.username}
          <FaChevronDown size={12} className=" ms-3" aria-hidden="true" />
        </button>

                    </>


          ):(

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
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p className="text-sm text-gray-100 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                 disabled={isLoggingOut}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
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
        title="Open menu"
      >
        <RiMenu3Line className="w-6 h-6" />
      </button>

   
      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />
    </header>
  );
}

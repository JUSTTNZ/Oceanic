"use client";
import Link from "next/link";
export default function Homepage() {
  return (
    <div className="bg-white text-black">
      <div className="flex items-center space-x-2 p-6 font-bold justify-between">
        <h1 className="text-5xl ">Oceanic <span className="">Charts</span></h1>
        <nav className="flex text-2xl space-x-16 font-semibold">
          <Link href="/products">
            <p>Products</p>
          </Link>
          <Link href="/resources">
            <p>Resources</p>
          </Link>
          <Link href="/company">
            <p>Company</p>
          </Link>
        </nav>
        <div className="flex mr-4 space-x-8">
          <p className="btn btn-primary bg-blue">Sign in</p>
          <p className="btn btn-secondary">Sign up</p>
        </div>
      </div>
      
    </div>
  );
}
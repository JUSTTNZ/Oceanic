"use client"

export default function Header(){
    return(
        <header className="bg-purple-900 text-white p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold">Quidax</h1>
        <nav className="flex gap-6">
          <a href="#" className="hover:underline">QDX Token</a>
          <a href="#" className="hover:underline">Instant Swap</a>
          <a href="#" className="hover:underline">Order Book</a>
          <a href="#" className="hover:underline">Sign In</a>
          <button className="bg-white text-purple-900 px-4 py-2 rounded-lg font-semibold">Create Account</button>
        </nav>
      </header>
    )
}
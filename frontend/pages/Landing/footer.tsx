import Link from 'next/link';
import { FaTwitter, FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-800 to-blue-900 text-white py-6 border-t border-gray-200 font-grotesk text-sm">
      <div className="container mx-auto px-6 flex flex-col items-center text-gray-100 text-sm space-y-4 lg:space-y-0 lg:flex-row lg:justify-between">
        
        <p className="text-center lg:text-left">
          ©{new Date().getFullYear()} Oceanic Charts. All Rights Reserved.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-center">
          <a href="#" className="hover:text-blue-600">Blog</a>
          <span className="hidden lg:inline">·</span>
          <a href="#" className="hover:text-blue-600">API</a>
          <span className="hidden lg:inline">·</span>
          <a href="#" className="hover:text-blue-600">System Status</a>
          <span className="hidden lg:inline">·</span>
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <span className="hidden lg:inline">·</span>
          <a href="#" className="hover:text-blue-600">Terms of Use</a>
          <span className="hidden lg:inline">·</span>
          <Link href="/support" className="hover:text-blue-600">FAQ</Link>
          <span className="hidden lg:inline">·</span>
          <Link href="/support" className="hover:text-blue-600">Support</Link>
        </div>

        <div className="flex space-x-4">
          {/* X / Twitter */}
          <a
            href="https://x.com/oceanic__charts?s=21"
            aria-label="Oceanic Charts on X"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaTwitter size={18} />
          </a>

          {/* Instagram */}
          <a
            href="#"
            aria-label="Oceanic Instagram"
            className="hover:text-blue-600"
          >
            <FaInstagram size={18} />
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/OceanicTradeCharts"
            aria-label="Oceanic Telegram Channel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaTelegramPlane size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}

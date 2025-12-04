import { FaFacebookF, FaTwitter, FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-6 border-t border-gray-900 font-grotesk text-sm">
      <div className="container mx-auto px-6 flex flex-col items-center t text-sm space-y-4 lg:space-y-0 lg:flex-row lg:justify-between">
        
       
        <p className="text-center text-white lg:text-left">©{new Date().getFullYear()} Oceanic. All Rights Reserved.</p>

        <div className="flex flex-wrap justify-center gap-3 text-center ">
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
          <a href="/support" className="hover:text-blue-600">FAQ</a>
          <span className="hidden lg:inline">·</span>
          <a href="/support" className="hover:text-blue-600">Support</a>
        </div>

        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600"><FaFacebookF size={18} /></a>
          <a href="#" className="hover:text-blue-600"><FaTwitter size={18} /></a>
          <a href="#" className="hover:text-blue-600"><FaInstagram size={18} /></a>
          <a href="#" className="hover:text-blue-600"><FaTelegramPlane size={18} /></a>
        </div>

      </div>
    </footer>
  );
}

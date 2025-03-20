import { FaFacebookF, FaTwitter, FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="container mx-auto px-6 flex flex-col items-center text-gray-600 text-sm space-y-4 md:space-y-0 md:flex-row md:justify-between">
        
        {/* Left Section: Copyright */}
        <p className="text-center md:text-left">©2025 Quidax. All Rights Reserved.</p>

        {/* Center Section: Navigation Links (Stacks on mobile) */}
        <div className="flex flex-wrap justify-center gap-3 text-center">
          <a href="#" className="hover:text-blue-600">Blog</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">API</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">System Status</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">Terms of Use</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">FAQ</a>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:text-blue-600">Support</a>
        </div>

        {/* Right Section: Social Icons */}
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

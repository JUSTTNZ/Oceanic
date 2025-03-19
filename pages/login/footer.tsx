import { FaFacebookF, FaTwitter, FaInstagram, FaTelegramPlane } from "react-icons/fa";

export default function Footer () {
  return (
    <footer className="bg-white py-4  border-t border-white">
    <div className="container mx-auto px-4 p-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
      {/* Left Section: Copyright */}
      <p className="text-center md:text-left">©2025 Quidax. All Rights Reserved.</p>

      {/* Center Section: Navigation Links */}
      <div className="flex flex-wrap justify-center space-x-3 md:space-x-4 my-2 md:my-0">
        <a href="#" className="hover:text-blue-600">Blog</a>
        <span>·</span>
        <a href="#" className="hover:text-blue-600">API</a>
        <span>·</span>
        <a href="#" className="hover:text-blue-600">System Status</a>
        <span>·</span>
        <a href="#" className="hover:text-blue-600">Privacy Policy</a>
        <span>·</span>
        <a href="#" className="hover:text-blue-600">Terms of Use</a>
        <span>·</span>
        <a href="#" className="hover:text-blue-600">FAQ</a>
        <span>·</span>
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
};



import Link from 'next/link';
import { FaTwitter, FaInstagram, FaTelegramPlane } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Markets", href: "/markets" },
    { label: "Trading", href: "/trade" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "API", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "FAQ", href: "/support" },
    { label: "System Status", href: "#" },
    { label: "Contact Us", href: "/support" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        {/* Top row: Logo + Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-6 md:gap-8">
          {/* Logo column */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1 mb-4 md:mb-0">
            <Link href="/">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Oceanic <span className="text-[#3b82f6]">Charts</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              Your gateway to seamless digital asset trading.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-white text-xs sm:text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.08] mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs sm:text-sm order-2 sm:order-1">
              &copy;{new Date().getFullYear()} Oceanic Charts. All Rights Reserved.
            </p>

            <div className="flex space-x-5 order-1 sm:order-2">
              <a
                href="https://x.com/oceanic__charts?s=21"
                aria-label="Oceanic Charts on X"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="#"
                aria-label="Oceanic Instagram"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://t.me/OceanicTradeCharts"
                aria-label="Oceanic Telegram Channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTelegramPlane size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

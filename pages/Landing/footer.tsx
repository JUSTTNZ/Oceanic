import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from 'react-icons/fa';

const Footer = () => {
  return (
    // bg-[#080616]
    <footer className="bg-blue-400 text-white py-10 px-6 md:px-16 lg:px-15 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Quidax Info */}
        <div>
          <h2 className="text-4xl font-bold font-maven">Oceanic</h2>
          <p className="mt-4 text-sm">
            We’re the first crypto exchange to receive a provisional Digital Assets Exchange license by Nigeria’s SEC.
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebook className="text-2xl cursor-pointer hover:text-gray-300" />
            <FaTwitter className="text-2xl cursor-pointer hover:text-gray-300" />
            <FaInstagram className="text-2xl cursor-pointer hover:text-gray-300" />
            <FaTelegram className="text-2xl cursor-pointer hover:text-gray-300" />
          </div>
        </div>

        {/* Products */}
        <div className='px-5'>
          <h3 className="text-xl font-semibold">Products</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["Cards", "OCE Token", "OCE Vault", "Instant Swap", "Order Book", "Self-Service Listing", "OTC Desk", "API"].map((item, index) => (
              <li key={index}>
                <Link href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-400 px-2 py-1 block rounded">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h3 className="text-xl font-semibold">Learn</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["Buy Crypto", "Buy Bitcoin in Nigeria", "Buy USDT"].map((item, index) => (
              <li key={index}>
                <Link href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-400 px-2 py-1 block rounded">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl font-semibold">Resources</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["FAQs", "Oceanic Support", "Law Enforcement", "Oceanic Blog", "Ocenic Academy"].map((item, index) => (
              <li key={index}>
                <Link href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-400 px-2 py-1 block rounded">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company & Legal */}
        <div>
          <h3 className="text-xl font-semibold">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["About Us", "Careers"].map((item, index) => (
              <li key={index}>
                <Link href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-400 px-2 py-1 block rounded">
                  {item}
                </Link>
              </li>
            ))}
          </ul>

        </div>

        <div>

          <h3 className="text-xl font-semibold ">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {["Privacy Policy", "Terms of Use"].map((item, index) => (
              <li key={index}>
                <Link href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-400 px-2 py-1 block rounded">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
         <div className="border-t w-full mt-8 pt-4 text-center text-sm"> 
        &copy; {new Date().getFullYear()} Oceanic. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
export default function Homepage() {

  const [hoverItem, setHoverItem] = useState<string | null>(null);

  const menuItems = [
    {name: 'Products', link: '/products', subMenu: [{image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Instant Swaps', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Order Book', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Launch pad', subTitle: 'spend your money with a card that does it all'}]},
    {name: 'Products', link: '/products', subMenu: [{image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}]},
    {name: 'Products', link: '/products', subMenu: [{image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}, {image: '/images/card.png', title: 'Cards', subTitle: 'spend your money with a card that does it all'}]},
  ]
  return (
    <main className="bg-white text-black">
      <div className="flex  space-x-2 px-6 py-10  font-bold justify-between">
        <h1 className="text-5xl ">Oceanic <span className="text-[#007BFF]">Charts</span></h1>
        <nav className="flex text-2xl space-x-16 font-semibold pt-3">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoverItem(item.name)}
              onMouseLeave={() => setHoverItem(null)}
            >
              <Link href={item.link}>
                <p className={`flex items-center ${hoverItem === item.name ? ' text-blue-400' :  ''}`}>
                  {item.name}
                  <ChevronDownIcon className={`w-4 h-4 ml-3 transition-transform duration-500  ${hoverItem === item.name ? 'rotate-180 text-blue-400' :  ''}`} />
                </p>
              </Link>
              {hoverItem === item.name && (
                <div className="absolute flex mt-8 h-[30%] px-12 w-full left-0 items-center justify-between bg-white border-bottom border-gray-200 rounded-md shadow-lg transition-transform duration-500 ease-in-out">
                  {item.subMenu.map((subItem) => (
                    <Link href={item.link} key={subItem}>
                      <p className="block p-4">{subItem}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex mr-4 space-x-8 ">
          <p className="btn btn-primary text-[#007BFF] text-2xl pt-3 ">Sign in</p>
          <p className="btn btn-secondary text-white bg-[#007BFF] px-10 py-4 text-xl mb- rounded-md hover hover:bg-[#459af5]">Get Started</p>
        </div>
      </div>
      
    </main>
  );
}
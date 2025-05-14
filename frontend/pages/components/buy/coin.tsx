import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface CoinDropdownProps {
  coins: Coin[];
  selectedCoin: Coin | null;
  onSelect: (coin: Coin) => void;
  exchangeRate: number;
  formatCurrency: (amount: number) => string;
  className?: string;
}

export default function CoinDropdown({
  coins,
  selectedCoin,
  onSelect,

  className = ""
}: CoinDropdownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);

  // Filter coins based on search term
  useEffect(() => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [searchTerm, coins]);

  if (!selectedCoin) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-100">Cryptocurrency</label>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-between w-full border border-gray-500 px-4 py-3 rounded-lg text-sm hover:border-gray-600 focus:border-blue-600 focus:outline-none transition-colors"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        >
          <div className="flex items-center text-white">
            <Image 
              src={selectedCoin.image} 
              alt={selectedCoin.name} 
              width={24} 
              height={24} 
              className="mr-2 rounded-full"
            />
            <span>
              {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
            </span>
          </div>
          <ChevronDownIcon 
            className={`h-4 w-4 ml-2 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {showDropdown && (
          <div 
            className="absolute z-10 mt-1 w-full bg-gray-900 text-white border border-gray-800  rounded-lg shadow-lg"
            role="listbox"
          >
            <div className="p-2 border-b border-blue-600">
              <input
                type="text"
                placeholder="Search coins..."
                className="w-full px-3 py-2 text-sm border rounded-md focus:border-blue-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 text-left"
                    onClick={() => {
                      onSelect(coin);
                      setShowDropdown(false);
                      setSearchTerm("");
                    }}
                    role="option"
                    aria-selected={coin.id === selectedCoin.id}
                  >
                    <Image 
                      src={coin.image} 
                      alt={coin.name} 
                      width={20} 
                      height={20}
                      className="mr-2 rounded-full"
                    />
                    <span className="flex-1">
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </span>
                    
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-100">
                  No coins found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
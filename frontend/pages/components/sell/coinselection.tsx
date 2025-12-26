import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface CoinSelectionProps {
  setShowCoinDropdown: (show: boolean) => void;
  showCoinDropdown: boolean;
  selectedCoin: Coin | null;
  searchCoin: string;
  setSearchCoin: (search: string) => void;
  setSelectedCoin: (coin: Coin) => void;
  filteredCoins: Coin[];
  status: 'pending' | 'sent' | 'received' | 'confirmed' | 'failed' | "txid-exists";
}

export default function CoinSelection({
  setShowCoinDropdown,
  showCoinDropdown,
  selectedCoin,
  searchCoin,
  setSearchCoin,
  setSelectedCoin,
  filteredCoins,
}: CoinSelectionProps) {
  
  // Filter coins based on search query
  const searchFilteredCoins = useMemo(() => {
    if (!searchCoin.trim()) return filteredCoins;
    
    const query = searchCoin.toLowerCase();
    return filteredCoins.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    );
  }, [searchCoin, filteredCoins]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-100">Cryptocurrency</label>
      
      {/* Scrollable Coin List - Hidden Scrollbar */}
      <style>{`
        .coin-scroll-horizontal::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div 
        className="coin-scroll-horizontal flex gap-2 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={(e) => {
          const ele = e.currentTarget;
          const startX = e.pageX - ele.offsetLeft;
          const scrollLeft = ele.scrollLeft;
          
          const handleMouseMove = (e: MouseEvent) => {
            const x = e.pageX - ele.offsetLeft;
            const walk = (x - startX) * 2;
            ele.scrollLeft = scrollLeft - walk;
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            ele.style.cursor = 'grab';
          };
          
          ele.style.cursor = 'grabbing';
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        {filteredCoins.map((coin) => (
          <button
            key={coin.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCoin(coin);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              selectedCoin?.id === coin.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            <Image 
              src={coin.image} 
              alt={coin.name} 
              width={20} 
              height={20} 
              className="rounded-full pointer-events-none"
            />
            <span className="text-sm pointer-events-none">{coin.symbol.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Dropdown with Search */}
      <div className="relative mt-2">
        <button
          onClick={() => setShowCoinDropdown(!showCoinDropdown)}
          className="flex items-center text-white justify-between w-full border border-gray-500 px-4 py-3 rounded-lg text-sm focus:border-blue-600 focus:outline-none hover:border-gray-400 transition-colors"
        >
          {selectedCoin ? (
            <div className="flex items-center">
              <Image 
                src={selectedCoin.image} 
                alt={selectedCoin.name} 
                width={24} 
                height={24} 
                className="mr-2 rounded-full"
              />
              <span>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
            </div>
          ) : (
            <span>Select cryptocurrency</span>
          )}
          <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showCoinDropdown ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showCoinDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full bg-gray-900 text-white border border-gray-800 rounded-lg shadow-lg"
            >
              <div className="p-2 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search coins..."
                  className="w-full px-3 py-2 text-sm bg-gray-800 text-white border border-gray-700 rounded-md focus:border-blue-600 focus:outline-none"
                  value={searchCoin}
                  onChange={(e) => setSearchCoin(e.target.value)}
                  autoFocus
                />
              </div>
              
              {/* Dropdown List - Hidden Scrollbar */}
              <style>{`
                .coin-dropdown-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div 
                className="coin-dropdown-scroll max-h-60 overflow-y-auto"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {searchFilteredCoins.length > 0 ? (
                  searchFilteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                      onClick={() => {
                        setSelectedCoin(coin);
                        setShowCoinDropdown(false);
                        setSearchCoin("");
                      }}
                    >
                      <Image 
                        src={coin.image} 
                        alt={coin.name} 
                        width={20} 
                        height={20} 
                        className="mr-2 rounded-full"
                      />
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No coins found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
  status: 'pending' | 'sent' | 'received' | 'completed' | 'failed';
}

export default function CoinSelection({
  setShowCoinDropdown,
  showCoinDropdown,
  selectedCoin,
  searchCoin,
  setSearchCoin,
  setSelectedCoin,
  filteredCoins,
  status
}: CoinSelectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Cryptocurrency</label>
      <div className="relative">
        <button
          onClick={() => setShowCoinDropdown(!showCoinDropdown)}
          className="flex items-center justify-between w-full border px-4 py-3 rounded-lg text-sm focus:border-blue-300 focus:outline-none"
          disabled={status !== 'pending'}
        >
          {selectedCoin ? (
            <div className="flex items-center">
              <Image 
                src={selectedCoin.image} 
                alt={selectedCoin.name} 
                width={24} 
                height={24} 
                className="mr-2"
              />
              <span>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
            </div>
          ) : (
            <span>Select cryptocurrency</span>
          )}
          <ChevronDownIcon className="h-4 w-4 ml-2" />
        </button>

        <AnimatePresence>
          {showCoinDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div className="p-2 border-b border-blue-300">
                <input
                  type="text"
                  placeholder="Search coins..."
                  className="w-full px-3 py-2 text-sm border rounded-md focus:border-blue-300 focus:outline-none"
                  value={searchCoin}
                  onChange={(e) => setSearchCoin(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto scrollbar-hide">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-blue-100"
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
                        className="mr-2"
                      />
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
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
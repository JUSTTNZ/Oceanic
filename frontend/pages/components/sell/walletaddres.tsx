import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WalletAddress {
  address: string;
  network: string;
  note?: string;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price?: number;
}

interface Country {
  name: string;
  code: string;
}

type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed' | "txid-exists";

interface WalletAddressDisplayProps {
  selectedCoin: Coin | null;
  selectedCountry: Country;
  walletAddresses: WalletAddress[];
  status: TransactionStatus;
  className?: string;
}

export default function WalletAddressDisplay({
  selectedCoin,
  selectedCountry,
  walletAddresses = [],
  status,
  className = ""
}: WalletAddressDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!selectedCoin || walletAddresses.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-100">
          Our {selectedCoin.symbol.toUpperCase()} Address
          {walletAddresses.length > 1 ? "es" : ""}
        </label>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {selectedCountry.name}
        </span>
      </div>

      <AnimatePresence>
        {walletAddresses.map((addr, index) => (
          <motion.div
            key={addr.network}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-between bg-gray-900 text-white p-3 rounded-lg mb-2"
          >
            <div className="flex items-center flex-1 min-w-0">
              {selectedCoin.image && (
                <div className="mr-2">
                  <Image 
                    src={selectedCoin.image} 
                    alt={selectedCoin.name} 
                    width={20} 
                    height={20}
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-1">{addr.network}</div>
                <code className="text-xs break-all">{addr.address}</code>
              </div>
            </div>
            <button 
              onClick={() => handleCopy(addr.address, index)}
              className="ml-2 p-1 rounded-md hover:bg-gray-800 transition-colors"
              disabled={status !== 'pending'}
            >
              {copiedIndex === index ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {walletAddresses.length > 0 && (
        <p className="text-xs text-gray-500">
          {walletAddresses[0]?.note || 
           `Only send ${selectedCoin.symbol.toUpperCase()} to these addresses`}
        </p>
      )}
    </div>
  );
}
import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

type TransactionStatus = 'pending' | 'sent' | 'received' | 'completed' | 'failed';

interface WalletAddressDisplayProps {
  selectedCoin: Coin | null;
  selectedCountry: Country;
  walletAddress: string | null;
  status: TransactionStatus;
  className?: string;
  
}

export default function WalletAddressDisplay({
  selectedCoin,
  selectedCountry,
  walletAddress,
  status,
  className = ""
}: WalletAddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShowTooltip(false), 1500);
      })
      .catch(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1500);
      });
  };

  if (!selectedCoin || !walletAddress) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">
          Our {selectedCoin.symbol.toUpperCase()} Address
        </label>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {selectedCountry.name}
        </span>
      </div>
      
      <div className="relative flex items-center justify-between bg-gray-50 p-3 rounded-lg">
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
        <code className="text-xs truncate flex-1">{walletAddress}</code>
        
        <div className="relative">
          <button 
            onClick={handleCopy}
            className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            disabled={status !== 'pending'}
            aria-label={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
              >
                {copied ? "Copied!" : "Failed to copy"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        Only send {selectedCoin.symbol.toUpperCase()} to this address. 
        Sending other assets may result in permanent loss.
      </p>
    </div>
  );
}
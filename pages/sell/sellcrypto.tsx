"use client";


import { motion } from "framer-motion";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface Country {
  name: string;
  code: string;
}

const BYBIT_WALLET_ADDRESSES: Record<string, Record<string, string>> = {
  USDT: { NG: "0xYourBybitUSDTWallet", US: "0xYourBybitUSDTWalletUS" },
  BTC: { NG: "bc1YourBybitBTCWallet", US: "bc1YourBybitBTCWalletUS" },
  ETH: { NG: "0xYourBybitETHWallet", US: "0xYourBybitETHWalletUS" },
};

export default function SellCrypto  ({ selectedCoin, selectedCountry, txid,  setTxid,}: {  selectedCoin: Coin | null; selectedCountry: Country; txid: string; setTxid: (txid: string) => void})  {
  return (
    <motion.div
      key="sell"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto py-14 px-4"
    >
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Sell your crypto <br /> Instantly and securely.
        </h1>
        <p className="text-gray-600 text-base">
          Copy our wallet address, send your crypto, and enter your transaction
          hash (TXID) to confirm.
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-center font-semibold text-lg mb-4">Sell Crypto</h2>
        <p className="text-gray-500">
          Send to:{" "}
          {selectedCoin
            ? BYBIT_WALLET_ADDRESSES[selectedCoin.symbol.toUpperCase()][
                selectedCountry.code
              ]
            : "Select a coin"}
        </p>
        <input
          type="text"
          placeholder="Enter TXID"
          className="border px-4 py-3 rounded-lg w-full mt-4"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
        />
        <button className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4">
          Submit TXID
        </button>
      </div>
    </motion.div>
  );
};
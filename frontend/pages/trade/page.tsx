"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BuyCrypto from "./buycrypto";
import SellCrypto from "./sellcrypto";

export default function CryptoExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  return (
    <div className="bg-gray-900 min-h-screen pt-20 pb-10 font-grotesk">
      <AnimatePresence mode="wait">
        {activeTab === "buy" ? (
          <BuyCrypto activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <SellCrypto activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </AnimatePresence>
    </div>
  );
}

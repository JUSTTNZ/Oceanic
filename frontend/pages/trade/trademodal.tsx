"use client";

import { AnimatePresence, motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export type TradeModalStep = "confirm" | "loading" | "success" | "error";

interface ConfirmDetails {
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  coinPrice: number;
  purchaseAmount: number;
  receiveAmount: number;
  fee: number;
  totalPay: number;
  currency: string;
  currencySymbol: string;
  type: "buy" | "sell";
}

interface TradeModalProps {
  step: TradeModalStep;
  details: ConfirmDetails;
  errorMessage?: string;
  onConfirm: () => void;
  onClose: () => void;
  onRetry?: () => void;
}

const TradeModal = ({ step, details, errorMessage, onConfirm, onClose, onRetry }: TradeModalProps) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (step === "success" || step === "error") {
      const sequence = async () => {
        await controls.start("drawCircle");
        await controls.start("drawIcon");
      };
      sequence();
    }
  }, [step, controls]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const circleVariants: Variants = {
    hidden: { pathLength: 0, rotate: 0 },
    drawCircle: {
      pathLength: 1,
      rotate: 360,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const iconVariants: Variants = {
    hidden: { pathLength: 0, scale: 0 },
    drawIcon: {
      pathLength: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== "loading" ? handleClose : undefined}
        >
          <motion.div
            className="w-full max-w-sm relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CONFIRM STEP */}
            {step === "confirm" && (
              <div className="bg-gray-900 border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 pb-4 border-b border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Confirm {details.type === "buy" ? "Purchase" : "Sale"}</h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Payment method */}
                <div className="px-5 py-3 border-b border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Paystack</p>
                        <p className="text-gray-400 text-xs">Secure payment</p>
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>

                {/* Transaction details */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{details.coinSymbol.toUpperCase()} Price</span>
                    <span className="text-white font-medium">${formatCurrency(details.coinPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{details.type === "buy" ? "Purchase" : "Sale"}</span>
                    <span className="text-white font-medium">
                      {details.currencySymbol}{formatCurrency(details.purchaseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Receive</span>
                    <span className="text-white font-medium">
                      {details.type === "buy"
                        ? `${details.receiveAmount.toFixed(8)} ${details.coinSymbol.toUpperCase()}`
                        : `${details.currencySymbol}${formatCurrency(details.receiveAmount)}`}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="px-5 py-4 border-t border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">Total Pay</span>
                    <span className="text-white font-bold text-lg">
                      {details.currencySymbol}{formatCurrency(details.totalPay)}
                    </span>
                  </div>
                </div>

                {/* Confirm button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={onConfirm}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* LOADING STEP */}
            {step === "loading" && (
              <div className="bg-gray-900 border border-gray-700/40 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-white font-semibold text-lg mb-1">Processing</p>
                <p className="text-gray-400 text-sm text-center">Please wait while we process your transaction...</p>
              </div>
            )}

            {/* SUCCESS STEP */}
            {step === "success" && (
              <div className="rounded-2xl shadow-2xl overflow-hidden">
                {/* Gradient header */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 px-6 pt-10 pb-8 flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-5">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                      <motion.circle
                        cx="40" cy="40" r="36"
                        fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round"
                        variants={circleVariants} initial="hidden" animate={controls}
                      />
                    </motion.svg>
                    <motion.div className="absolute inset-0 flex items-center justify-center" variants={iconVariants} initial="hidden" animate={controls}>
                      <Check size={40} strokeWidth={2.5} className="text-white" />
                    </motion.div>
                  </div>
                  <h2 className="text-white text-2xl font-bold mb-2">All Done</h2>
                  <p className="text-blue-100 text-sm text-center max-w-xs">
                    Your {details.receiveAmount.toFixed(8)} {details.coinSymbol.toUpperCase()} will be deposited into your wallet within minutes!
                  </p>
                </div>

                {/* Done button */}
                <div className="bg-gray-900 px-6 py-5">
                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* ERROR STEP */}
            {step === "error" && (
              <div className="bg-gray-900 border border-gray-700/40 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-5">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-900/20"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                      <motion.circle
                        cx="40" cy="40" r="36"
                        fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"
                        variants={circleVariants} initial="hidden" animate={controls}
                      />
                    </motion.svg>
                    <motion.div className="absolute inset-0 flex items-center justify-center" variants={iconVariants} initial="hidden" animate={controls}>
                      <X size={40} strokeWidth={2.5} className="text-red-500" />
                    </motion.div>
                  </div>
                  <h2 className="text-white text-xl font-bold mb-2">Transaction Failed</h2>
                  <p className="text-gray-300 text-sm text-center mb-6">
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                  <div className="flex gap-3 w-full">
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Try Again
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      className={`${onRetry ? "flex-1" : "w-full"} py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TradeModal;

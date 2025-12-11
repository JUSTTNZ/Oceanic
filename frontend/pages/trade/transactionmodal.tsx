"use client";

import { AnimatePresence, motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface Props {
  type: "success" | "error" | "pending";
  title: string;
  message: string;
  details?: {
    coin?: string;
    amount?: number;
    status?: string;
    txid?: string;
    [key: string]: string | number | boolean | undefined;
  };
  onClose: () => void;
}

const TransactionStatusModal = ({ type, title, message, details, onClose }: Props) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (type !== 'pending' || !details) return;

    // compute expiry: prefer createdAt from details, otherwise persisted expiry in localStorage, otherwise now + 10min
    const key = details.txid ? `tx_expiry_${details.txid}` : null;
    let expiry = null as number | null;
    if (details.createdAt) {
      expiry = new Date(String(details.createdAt)).getTime() + 10 * 60 * 1000;
      if (key) localStorage.setItem(key, String(expiry));
    } else if (key) {
      const stored = localStorage.getItem(key);
      if (stored) expiry = parseInt(stored, 10);
    }

    if (!expiry) {
      expiry = Date.now() + 10 * 60 * 1000;
      if (key) localStorage.setItem(key, String(expiry));
    }

    const tick = () => {
      const ms = expiry! - Date.now();
      setRemainingMs(ms > 0 ? ms : 0);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [type, details]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start("drawCircle");
      await controls.start("drawIcon");
    };
    sequence();
  }, [controls]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const circleVariants: Variants = {
    hidden: { pathLength: 0, rotate: 0 },
    drawCircle: {
      pathLength: 1,
      rotate: 360,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { pathLength: 0, scale: 0 },
    drawIcon: {
      pathLength: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    }
  };

  const pulseVariants: Variants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1] // ✅ type-safe easing
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-r from-gray-900 to-gray-500 text-white p-6 rounded-2xl w-full max-w-sm relative shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative flex justify-center items-center h-24 w-24 mx-auto mb-4">
              {/* Pulsing background glow */}
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  type === "success" ? "bg-green-900/20" : "bg-red-900/20"
                }`}
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
              />

              {/* Animated Circle */}
              <motion.svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                className="absolute"
              >
                <motion.circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke={type === "success" ? "#10B981" : "#EF4444"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={circleVariants}
                  initial="hidden"
                  animate="drawCircle"
                />
              </motion.svg>

              {/* Animated Icon */}
              <motion.div
                className="absolute"
                variants={iconVariants}
                initial="hidden"
                animate="drawIcon"
              >
                {type === "success" ? (
                  <Check size={48} strokeWidth={2.5} className="text-green-500" />
                ) : (
                  <X size={48} strokeWidth={2.5} className="text-red-500" />
                )}
              </motion.div>
            </div>

            <h2 className="text-center text-xl font-bold mb-2">{title}</h2>
            <p className="text-center text-sm text-gray-100 mb-4">{message}</p>

            {details && (
              <div className="mt-5 text-sm space-y-3 max-h-60 overflow-y-auto pr-2">
                {type === 'pending' && remainingMs !== null && (
                  <div className="mb-3 text-center">
                    <p className="text-xs text-gray-300">Time remaining</p>
                    <p className="text-lg font-semibold text-white">{new Date(remainingMs).toISOString().substr(14,5)}</p>
                  </div>
                )}

                {Object.entries(details).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <p className="font-medium capitalize text-gray-100">{key}</p>
                      <p className="text-gray-200 break-all">{String(value)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.button
              onClick={handleClose}
              className="mt-6 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm font-medium rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionStatusModal;

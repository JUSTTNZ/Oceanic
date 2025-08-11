"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const colors: Record<ToastType, { bg: string; text: string; border: string; fill: string }> = {
    success: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-500",
      fill: "bg-green-500",
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-500",
      fill: "bg-red-500",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-500",
      fill: "bg-blue-500",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-500",
      fill: "bg-yellow-500",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 15, stiffness: 200 },
          }}
          exit={{
            opacity: 0,
            y: -50,
            transition: { type: "tween", ease: "easeIn", duration: 0.2 },
          }}
          className={`fixed left-1/2 top-5 z-50 w-full max-w-sm -translate-x-1/2 transform ${colors[type].bg} ${colors[type].text} border-l-4 ${colors[type].border} px-4 py-3 rounded shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm">{message}</div>
            {onClose && (
              <button
                onClick={() => setIsVisible(false)}
                className={`ml-2 h-5 w-5 rounded-full ${colors[type].fill} text-white flex items-center justify-center`}
                aria-label="Close toast"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

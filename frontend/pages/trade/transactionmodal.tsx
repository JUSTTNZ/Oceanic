// components/shared/TransactionStatusModal.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  type: "success" | "error";
  title: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  onClose: () => void;
}

export default function TransactionStatusModal({ type, title, message, details, onClose }: Props) {
  const Icon = type === "success" ? CheckCircleIcon : XCircleIcon;
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";
  const ringColor = type === "success" ? "border-green-500" : "border-red-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full relative shadow-xl">
        <motion.div
          className={`relative flex justify-center items-center h-20 w-20 mx-auto mb-4`}
        >
          <motion.div
            className={`absolute h-full w-full rounded-full border-4 ${ringColor}`}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          <Icon className={`h-16 w-16 ${iconColor} z-10 bg-white rounded-full`} />
        </motion.div>

        <h2 className="text-center text-xl font-bold mb-2">{title}</h2>
        <p className="text-center text-sm text-gray-600">{message}</p>

        {details && (
          <div className="text-left mt-4 text-sm text-gray-700 space-y-1">
            {Object.entries(details).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

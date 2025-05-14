"use client";

import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  HashtagIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { JSX } from "react";

interface Props {
  type: "success" | "error";
  title: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  onClose: () => void;
}

const iconMap: Record<string, JSX.Element> = {
  coin: <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />,
  amount: <CurrencyDollarIcon className="h-5 w-5 text-green-600" />,
  txid: <HashtagIcon className="h-5 w-5 text-orange-500" />,
  status: <ArrowPathIcon className="h-5 w-5 text-purple-600" />,
  type: <ClockIcon className="h-5 w-5 text-emerald-600" />,
  country: <GlobeAltIcon className="h-5 w-5 text-cyan-700" />,
  id: <FingerPrintIcon className="h-5 w-5 text-gray-600" />,
};

const TransactionStatusModal = ({ type, title, message, details, onClose }: Props) => {
  const Icon = type === "success" ? CheckCircleIcon : XCircleIcon;
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";
  const ringColor = type === "success" ? "border-green-500" : "border-red-500";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center px-4">
      <div className="bg-gray-800 text-white p-6 rounded-2xl w-full max-w-sm relative shadow-xl">
        <motion.div
          className="relative flex justify-center items-center h-20 w-20 mx-auto mb-4"
        >
          <motion.div
            className={`absolute h-full w-full rounded-full border-4 ${ringColor}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2 }}
          />
          <Icon className={`h-16 w-16 ${iconColor} z-10 bg-white rounded-full`} />
        </motion.div>

        <h2 className="text-center text-xl font-bold mb-2">{title}</h2>
        <p className="text-center text-sm text-gray-100">{message}</p>

        {details && (
          <div className="mt-5 text-sm space-y-3">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex items-start space-x-2">
                <span>{iconMap[key.toLowerCase()] || <FingerPrintIcon className="h-5 w-5 text-gray-500" />}</span>
                <div>
                  <p className="font-medium capitalize text-gray-100">{key}</p>
                  <p className="text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-sm font-medium rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionStatusModal;

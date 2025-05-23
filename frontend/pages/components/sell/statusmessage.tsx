import { AnimatePresence, motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed';

interface StatusMessageProps {
  status: TransactionStatus;
  isChecking: boolean;
  onReset: () => void;
}

const statusMessages = {
  pending: "Please send your crypto and submit the TXID",
  sent: "Waiting for transaction confirmation...",
  received: "Transaction received! Processing your payment...",
  confirmed: "Payment completed! Awaiting admin confirmation.",
  failed: "Transaction not found. Please verify your TXID and try again."
};

export default function StatusMessage({ 
  status, 
  isChecking, 
  onReset 
}: StatusMessageProps) {
  return (
    <AnimatePresence mode="wait">
      {status !== 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-lg text-sm ${
            status === 'confirmed' ? 'bg-green-50 text-green-700' :
            status === 'failed' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            {isChecking && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            <p>{statusMessages[status]}</p>
          </div>
          {(status === 'confirmed' || status === 'failed') && (
            <button
              onClick={onReset}
              className="mt-2 text-sm underline hover:text-blue-600"
            >
              Start new transaction
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
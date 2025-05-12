"use client";

import { usePaystackPayment } from "react-paystack";
import { useEffect, useState } from "react";

interface Props {
  config: {
    reference: string;
    email: string;
    amount: number;
  };
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export default function PaystackButtonWrapper({ config, onSuccess, onClose }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize the hook unconditionally at the top level
  const initializePayment = usePaystackPayment({
    ...config,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={() => initializePayment({
        onSuccess,
        onClose,
      })}
      className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
    >
      Continue to Payment
    </button>
  );
}
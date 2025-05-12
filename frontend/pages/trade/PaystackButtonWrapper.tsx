"use client";

import { usePaystackPayment } from "react-paystack";

interface Props {
  config: any;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

export default function PaystackButtonWrapper({ config, onSuccess, onClose }: Props) {
  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() => initializePayment(onSuccess, onClose)}
      className="w-full bg-[#0047AB] text-white font-semibold py-3 rounded-full mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      Continue to Payment
    </button>
  );
}

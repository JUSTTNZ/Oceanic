import { useState, useEffect } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function AmountInput({
  value,
  onChange,
  className = "",
}: AmountInputProps) {
  const [amount, setAmount] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(input)) {
      setAmount(input);
      onChange(input);
    }
  };

  // Sync with parent value
  useEffect(() => {
    setAmount(value);
  }, [value]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-100">
        Amount in USDT (USD)
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
        <input
          type="text"
          placeholder="0.00"
          className="border border-gray-500 px-4 py-3 pl-8 rounded-lg w-full text-white text-right text-lg font-medium 
                     focus:border-blue-600 focus:outline-none bg-gray-800"
          value={amount}
          onChange={handleChange}
          inputMode="decimal"
        />
      </div>
    </div>
  );
}
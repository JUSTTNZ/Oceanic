import { useState, useEffect } from "react";

interface Country {
  currency: string;
  currencySymbol: string;
}

interface AmountInputProps {
  selectedCountry: Country;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function AmountInput({
  selectedCountry,
  value,
  onChange,
  className = ""
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
      <label className="text-sm font-medium text-gray-700">
        Amount in {selectedCountry.currency} ({selectedCountry.currencySymbol})
      </label>
      <input
        type="text"
        placeholder="0.00"
        className="border px-4 py-3 rounded-lg w-full text-right text-lg font-medium focus:border-blue-300 focus:outline-none"
        value={amount}
        onChange={handleChange}
        inputMode="decimal"
      />
    </div>
  );
}
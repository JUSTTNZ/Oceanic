interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

interface ConversionDisplayProps {
  selectedCountry?: {
    currencySymbol: string;
  }; // ✅ Made optional to avoid undefined errors
  selectedCoin?: Coin | null;
  serviceFee: number;
  amount: string;
  coinAmount: number;
  exchangeRate: number;
  formatCurrency: (amount: number) => string;
}

export default function ConversionDisplay({
  selectedCountry = { currencySymbol: "$" }, // ✅ Default fallback value
  selectedCoin,
  serviceFee,
  amount,
  coinAmount,
  exchangeRate,
  formatCurrency,
}: ConversionDisplayProps) {
  
  // ✅ Prevent rendering if essential data is missing
  if (!selectedCountry) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Service Fee:</span>
        <span className="font-medium">
          {selectedCountry?.currencySymbol}{serviceFee}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">You pay:</span>
        <span className="font-semibold">
          {selectedCountry?.currencySymbol}
          {parseFloat(amount || "0").toLocaleString("en-US")}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">You receive:</span>
        <span className="font-semibold">
          {coinAmount} {selectedCoin?.symbol?.toUpperCase() || "BTC"}
        </span>
      </div>
      {selectedCoin && (
        <div className="pt-2 text-xs text-gray-500 border-t">
          Rate: {formatCurrency(selectedCoin?.current_price * exchangeRate)} per{" "}
          {selectedCoin?.symbol?.toUpperCase() || "BTC"}
        </div>
      )}
    </div>
  );
}

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
    currency?: string;
  }; // ✅ Made optional to avoid undefined errors
  selectedCoin?: Coin | null;
  serviceFee: number;
  amount: string;
  coinAmount: number;
  exchangeRate: number;
  formatCurrency: (amount: number) => string;
}

export default function ConversionDisplay({
  selectedCountry ,
  selectedCoin,
  amount,
  coinAmount,
  exchangeRate,
  // formatCurrency,
}: ConversionDisplayProps) {
  
  // ✅ Prevent rendering if essential data is missing
  if (!selectedCountry) {
    return <p>Loading...</p>;
  }
  const safeCountry = selectedCountry || { name: "your country", currency: "USD", currencySymbol: "$" };
  
  const formatCurrency = (value: number): string => {
    if (!safeCountry.currency) {
      return value.toFixed(2);
    }

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCountry.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return safeCountry.currencySymbol
      ? formatter.format(value).replace(safeCountry.currency, safeCountry.currencySymbol)
      : formatter.format(value);
  };
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg space-y-2">
     
      <div className="flex justify-between items-center">
        <span className="text-gray-100">You pay:</span>
        <span className="font-semibold">
          {selectedCountry?.currencySymbol}
          {parseFloat(amount || "0").toLocaleString("en-US")}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-100">You receive:</span>
        <span className="font-semibold">
          {coinAmount} {selectedCoin?.symbol?.toUpperCase() || "BTC"}
        </span>
      </div>
      {selectedCoin && (
        <div className="pt-2 text-xs text-gray-100 border-t">
          Rate: {formatCurrency(selectedCoin?.current_price * exchangeRate)} per{" "}
          {selectedCoin?.symbol?.toUpperCase() || "BTC"}
        </div>
      )}
    </div>
  );
}

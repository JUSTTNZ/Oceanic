interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number; // Price in USD (same as USDT)
}

interface ConversionDisplayProps {
  selectedCountry?: {
    currencySymbol: string;
    currency?: string;
  };
  selectedCoin?: Coin | null;
  serviceFee: number;
  localCurrencyAmount: string;
  amount: string; // USDT (dollar) amount
  coinAmount: number;
  exchangeRate: number; // Local currency to USD rate
}

export default function ConversionDisplay({
  selectedCountry,
  selectedCoin,
  amount,
  coinAmount,
  exchangeRate,
}: ConversionDisplayProps) {
  
  if (!selectedCountry) {
    return <p>Loading...</p>;
  }

  const safeCountry = selectedCountry || { currency: "USD", currencySymbol: "$" };
  
  const formatCurrency = (value: number, currency: string = safeCountry.currency || 'USD'): string => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (currency === safeCountry.currency && safeCountry.currencySymbol) {
      return formatter.format(value).replace(currency, safeCountry.currencySymbol);
    }
    return formatter.format(value);
  };

  // Calculate amounts with +50 gain
  const adjustedExchangeRate = exchangeRate + 50;
  const usdAmount = parseFloat(amount || "0");
  const calculatedLocalCurrencyAmount = usdAmount * adjustedExchangeRate;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-100">Amount in {selectedCountry.currencySymbol}:</span>
        <div className="text-right">
          <span className="font-semibold block">
            {formatCurrency(calculatedLocalCurrencyAmount)}
          </span>
          
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-100">You receive:</span>
        <div className="text-right">
          <span className="font-semibold block">
            {coinAmount.toFixed(8)} {selectedCoin?.symbol?.toUpperCase() || "BTC"}
          </span>
        </div>
      </div>
      
      {selectedCoin && (
        <div className="pt-2 text-xs text-gray-100 border-t space-y-1">
          <div>
            Exchange Rate: $1 = {formatCurrency(adjustedExchangeRate)} 
          </div>
        </div>
      )}
    </div>
  );
}
import Image from "next/image";
interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
  }
  
  interface Country {
    name: string;
    currency?: string;
    code?: string;
    currencySymbol?: string;
  }
  
  interface CryptoPricesProps {
    coins: Coin[];
    selectedCountry: Country;
    exchangeRate: number;
  }
  export default function FirstSide({ coins = [], selectedCountry, exchangeRate }: CryptoPricesProps) {
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
      <div className="space-y-6 lg:px-0 px-2">
        <h1 className="text-3xl md:text-5xl font-bold">
          Buy Crypto Instantly <br /> With Local Currency
        </h1>
        <p className="text-gray-600 text-base">
          Get the best rates in {safeCountry.name} with instant delivery to your wallet.
        </p>
  
        {coins.length > 0 ? (
          <div className="pt-4">
            <h4 className="font-medium text-gray-700">Current Prices:</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {coins.slice(0, 4).map((coin) => (
                <div key={coin.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} className="mr-2" />
                  <div>
                    <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                    <p className="text-sm">{formatCurrency(coin.current_price * exchangeRate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading crypto prices...</p>
        )}
      </div>
    );
  }
  
  
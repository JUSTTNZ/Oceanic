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
        <h1 className="text-3xl md:text-5xl font-bold  bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Buy Crypto Instantly <br /> With Local Currency
        </h1>
        <p className="text-gray-100 text-base">
          Get the best rates in {safeCountry.name} with instant delivery to your wallet.
        </p>
  
        {coins.length > 0 ? (
          <div className="pt-4">
            <h4 className="font-medium text-gray-100">Current Prices:</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {coins.slice(0, 10).map((coin) => (
                <div key={coin.id} className="flex items-center  text-white bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} className="mr-2" />
                  <div className="md:text-sm text-xs">
                    <p className="font-medium">{coin.symbol.toUpperCase()}</p>
                    <p className="md:text-sm text-xs">{formatCurrency(coin.current_price * exchangeRate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-100">Loading crypto prices...</p>
        )}
      </div>
    );
  }
  
  
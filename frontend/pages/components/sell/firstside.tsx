import Image from "next/image";
  
  type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed';

      interface Country {
    name: string;
    currency?: string;
    code?: string;
    currencySymbol?: string;
  }
  interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
  }
  
  interface CryptoProps {
    SUPPORTED_COINS: Coin[];
    status?: TransactionStatus;
    exchangeRate :number
      selectedCountry: Country;

  }

  
export default function FirstSide ({ status = 'pending', SUPPORTED_COINS = [], selectedCountry,  exchangeRate = 1 }: Partial<CryptoProps>) {

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
    return(
        <div className="space-y-6 lg:px-0 px-2">
        <h1 className="text-3xl md:text-5xl font-bold  bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Sell your crypto <br /> Instantly and securely.
        </h1>
        <p className="text-gray-100 text-base">
          Follow these steps to sell your cryptocurrency:
        </p>
        
        <div className="space-y-4 text-white">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              1
            </div>
            <div>
              <h3 className="font-medium text-white">Select cryptocurrency and send to our wallet</h3>
              <p className="text-sm text-gray-500">
                Choose from {SUPPORTED_COINS.length} supported coins
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              status === 'pending' || status === 'sent' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              2
            </div>
            <div>
              <h3 className="font-medium">Submit your TXID</h3>
              <p className="text-sm text-gray-500">
                Paste the transaction hash to confirm your transfer
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              3
            </div>
            <div>
              <h3 className="font-medium">Receive payment</h3>
              <p className="text-sm text-gray-500">
                Funds will be sent to your bank account within minutes
              </p>
            </div>
          </div>
        </div>

      {SUPPORTED_COINS.length > 0 ? (
        <div className="pt-4">
          <h4 className="font-medium text-gray-100">Oceanic Rate:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
            {SUPPORTED_COINS.slice(0,10).map((coin) => (
              <div 
                key={coin.id} 
                className="flex flex-col items-center p-3 text-white bg-gray-800/30 border border-gray-700/20 rounded-xl hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-center mb-2">
                  <Image 
                    src={coin.image} 
                    alt={coin.name} 
                    width={24} 
                    height={24} 
                    className="mr-2" 
                  />
                  <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <p className="text-xs md:text-sm text-center">
                  {formatCurrency(coin.current_price * exchangeRate - 50)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-100">Loading crypto prices...</p>
      )}
      </div>
    )
}
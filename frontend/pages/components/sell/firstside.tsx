import Image from "next/image";

type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed' | 'admin_review';

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
  exchangeRate: number;
  selectedCountry: Country;
}

export default function FirstSide({ 
  status = 'pending', 
  SUPPORTED_COINS = [], 
  selectedCountry,  
  exchangeRate = 1 
}: Partial<CryptoProps>) {

  const safeCountry = selectedCountry || { 
    name: "your country", 
    currency: "USD", 
    currencySymbol: "$" 
  };

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

  const steps = [
    {
      id: 1,
      title: "Select cryptocurrency and send to our wallet",
      description: "Choose from our supported coins and send to the provided wallet address",
      status: ['pending', 'sent', 'received', 'confirmed', 'admin_review'].includes(status as TransactionStatus)
        ? 'completed'
        : 'pending'
    },
    {
      id: 2,
      title: "Submit your TXID",
      description: "Paste the transaction hash to confirm your transfer",
      status: ['sent', 'received', 'confirmed', 'admin_review'].includes(status as TransactionStatus)
        ? 'completed'
        : 'pending'
    },
    {
      id: 3,
      title: "Admin confirmation",
      description: "Our team is verifying your transaction",
      status: status === 'admin_review'
        ? 'active'
        : ['confirmed'].includes(status as TransactionStatus)
          ? 'completed'
          : 'pending'
    },
    {
      id: 4,
      title: "Receive payment",
      description: "Funds will be sent to your bank account",
      status: status === 'confirmed'
        ? 'completed'
        : 'pending'
    }
  ];

  return (
    <div className="space-y-6 lg:px-0 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Sell your crypto <br className="hidden sm:block" /> Instantly and securely.
      </h1>
      
      <p className="text-gray-100 text-base">
        Follow these steps to sell your cryptocurrency:
      </p>
      
      <div className="space-y-4 text-white">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
              step.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : step.status === 'active'
                  ? 'bg-blue-100 text-blue-600 animate-pulse'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {step.id}
            </div>
            <div>
              <h3 className="font-medium text-white">{step.title}</h3>
              <p className="text-sm text-gray-400">
                {step.description}
                {step.id === 3 && status === 'admin_review' && (
                  <span className="block mt-1 text-xs text-blue-400">
                    (Usually takes 5-30 minutes)
                  </span>
                )}
              </p>
            </div>
          </div>
<<<<<<< HEAD
        ))}
      </div>
=======
          
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
>>>>>>> 00aa18458838794d286faf0191bbf5b2960a2930

      {SUPPORTED_COINS.length > 0 ? (
        <div className="pt-4">
          <h4 className="font-medium text-gray-100 mb-2">Oceanic Rates:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SUPPORTED_COINS.slice(0, 8).map((coin) => (
              <div 
                key={coin.id} 
                className="flex flex-col items-center p-2 sm:p-3 text-white bg-gray-800/30 border border-gray-700/20 rounded-lg hover:border-blue-500/30 transition-all backdrop-blur-sm hover:shadow-blue-500/10"
              >
                <div className="flex items-center mb-1">
                  <Image 
                    src={coin.image} 
                    alt={coin.name} 
                    width={20} 
                    height={20} 
                    className="w-5 h-5 mr-2" 
                  />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <p className="text-xs text-center">
                  {formatCurrency(coin.current_price * exchangeRate - 50)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
}
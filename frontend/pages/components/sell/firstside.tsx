

  
  type TransactionStatus = 'pending' | 'sent' | 'received' | 'confirmed' | 'failed';

  
  interface CryptoProps {
    SUPPORTED_COINS: string[];
    status?: TransactionStatus;

  }
  
export default function FirstSide ({ status = 'pending', SUPPORTED_COINS = [] }: Partial<CryptoProps>) {


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
                Funds will be sent to your bank account within 24 hours
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="font-medium text-gray-100">Supported Cryptocurrencies:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {SUPPORTED_COINS.map(symbol => (
              <span key={symbol} className="px-3 py-1 text-white bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10 rounded-full text-sm">
                {symbol}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
}
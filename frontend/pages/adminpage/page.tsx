import { useState } from 'react';
import { FaCheck, FaTimes, } from 'react-icons/fa';

const AdminConfirm = () => {
  const [pendingTx, setPendingTx] = useState([
    {
      id: "txn-9264",
      user: "crypto_wizard_42",
      amount: "5 BTC",
      wallet: "bc1qxy2kg...0wlh",
      time: "2 mins ago",
      status: "pending"
    },
    {
      id: "txn-7153",
      user: "degen_trader",
      amount: "12.8 ETH",
      wallet: "0xAbC12345Ef...90d",
      time: "5 mins ago",
      status: "pending"
    },
    {
      id: "txn-9265",
      user: "bitcoin_maxi",
      amount: "3.2 BTC",
      wallet: "bc1qdef456...1xyz",
      time: "10 mins ago",
      status: "pending"
    },
    {
      id: "txn-7154",
      user: "eth_whale",
      amount: "24.5 ETH",
      wallet: "0xDef67890Ab...12c",
      time: "15 mins ago",
      status: "pending"
    },
    {
      id: "txn-9266",
      user: "altcoin_king",
      amount: "1500 SOL",
      wallet: "Hs1Zw9kLp...3mn",
      time: "20 mins ago",
      status: "pending"
    },
    {
      id: "txn-7155",
      user: "nft_guru",
      amount: "8.5 ETH",
      wallet: "0xNft12345Gh...67i",
      time: "25 mins ago",
      status: "pending"
    }
  ]);

  const handleConfirm = (id: string) => {
    setPendingTx(pendingTx.filter(tx => tx.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingTx(pendingTx.filter(tx => tx.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-grotesk pt-20">
      {/* Transaction Stream */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Pending Approvals
            </h2>
            <span className="text-xs bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
              {pendingTx.length} requests
            </span>
          </div>

          {pendingTx.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-gray-700/30">
                <FaCheck className="text-blue-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium mb-1 text-white">All clear!</h3>
              <p className="text-gray-400">No pending transactions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {pendingTx.map(tx => (
                <div 
                  key={tx.id} 
                  className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-5 hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-blue-300">@{tx.user}</h3>
                      <p className="text-xs text-gray-400 mt-1">{tx.wallet}</p>
                    </div>
                    <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full backdrop-blur-sm">
                      {tx.time}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-white">{tx.amount}</p>
                    <p className="text-xs text-gray-400 mt-1">Transaction ID: {tx.id}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleConfirm(tx.id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <FaCheck />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={() => handleReject(tx.id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20"
                    >
                      <FaTimes />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminConfirm;
import { useState, useEffect } from "react";
import { 
  FiArrowUp, FiArrowDown, FiStar, FiSearch, 
   FiFilter 
} from "react-icons/fi";
import Footer from "../login/footer";
import Header from "../login/header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}
interface RootState {
  user: {
    uid: number;
    email: string;
    username: string;
    roles: string;
  } | null;
}
export default function Markets() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const handleTradeClick = () => {
    if (user) {
      router.push("/trade");
    } else {
      router.push("/login");
    }
  };
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'asc' | 'desc' }>({ 
    key: 'market_cap', 
    direction: 'desc' 
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d");
        
        if (!response.ok) {
          setError(`API request failed with status ${response.status}.`);
        }
        
        const data = await response.json();
        setCoins(data);
        if (data.length > 0) {
          setSelectedCoin(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
        console.error("API Error:", err);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);



  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof Coin) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const toggleWatchlist = (coinId: string) => {
    setWatchlist(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId) 
        : [...prev, coinId]
    );
  };

  const getPriceChange = (coin: Coin) => {
    switch (timeRange) {
      case '1h': return coin.price_change_percentage_1h_in_currency || 0;
      case '24h': return coin.price_change_percentage_24h_in_currency || 0;
      case '7d': return coin.price_change_percentage_7d_in_currency || 0;
      default: return 0;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <section className="bg-gray-50">
      <Header />
      <div className="min-h-screen p-8 pt-30 pb-16 font-grotesk">
        <div className="max-w-7xl mx-auto">
        {error && (
  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
    <div className="flex items-center">
      <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="font-medium">{error}</p>
    </div>
  </div>
)}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-500 mb-2"> Markets</h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Global Market Cap</p>
                  <p className="font-semibold text-blue-400">
                    {formatNumber(coins.reduce((sum, coin) => sum + coin.market_cap, 0))}
                  </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="font-semibold text-blue-400">
                    {formatNumber(coins.reduce((sum, coin) => sum + coin.total_volume, 0))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <button 
                  onClick={() => setTimeRange('1h')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '1h' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  1h
                </button>
                <button 
                  onClick={() => setTimeRange('24h')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '24h' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  24h
                </button>
                <button 
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === '7d' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  7d
                </button>
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
               
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search coins..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="ml-4 flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <FiFilter className="mr-1" /> Filters
                  </button>
                </div>

                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('current_price')}
                        >
                          <div className="flex items-center justify-end">
                            Price
                            {sortConfig.key === 'current_price' && (
                              sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort(timeRange === '1h' ? 'price_change_percentage_1h_in_currency' : 
                                                   timeRange === '24h' ? 'price_change_percentage_24h_in_currency' : 
                                                   'price_change_percentage_7d_in_currency')}
                        >
                          <div className="flex items-center justify-end">
                            {timeRange === '1h' ? '1h' : timeRange === '24h' ? '24h' : '7d'}
                            {sortConfig.key.includes('price_change_percentage') && (
                              sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                            )}
                          </div>
                        </th>
                     
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chart
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                            {error}
                          </td>
                        </tr>
                      ) : filteredCoins.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No coins found 
                          </td>
                        </tr>
                      ) : (
                        filteredCoins.map((coin) => (
                          <tr 
                            key={coin.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedCoin?.id === coin.id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedCoin(coin)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                              
                                <div className="flex-shrink-0 h-8 w-8">
                                  <Image className="h-8 w-8 rounded-full" width={10} height={10} src={coin.image} alt={coin.name} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                                  <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getPriceChange(coin) >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {getPriceChange(coin) >= 0 ? (
                                  <FiArrowUp className="mr-0.5" />
                                ) : (
                                  <FiArrowDown className="mr-0.5" />
                                )}
                                {Math.abs(getPriceChange(coin)).toFixed(2)}%
                              </span>
                            </td>
                           
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="h-10 w-24">
                                {coin.sparkline_in_7d?.price && (
                                  <SparklineChart 
                                    data={coin.sparkline_in_7d.price} 
                                    positive={getPriceChange(coin) >= 0}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-1">
              {selectedCoin ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full lg:h-auto ">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Coin Details</h2>
                    <button 
                      onClick={() => toggleWatchlist(selectedCoin.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <FiStar className={`h-5 w-5 ${watchlist.includes(selectedCoin.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <Image className="h-12 w-12 rounded-full" width={12} height={12} src={selectedCoin.image} alt={selectedCoin.name} />
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900">{selectedCoin.name}</h3>
                        <p className="text-gray-500">{selectedCoin.symbol.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${selectedCoin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">1h Change</p>
                          <p className={`font-medium ${
                            selectedCoin.price_change_percentage_1h_in_currency && selectedCoin.price_change_percentage_1h_in_currency >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedCoin.price_change_percentage_1h_in_currency?.toFixed(2) || '0.00'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">24h Change</p>
                          <p className={`font-medium ${
                            selectedCoin.price_change_percentage_24h_in_currency && selectedCoin.price_change_percentage_24h_in_currency >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedCoin.price_change_percentage_24h_in_currency?.toFixed(2) || '0.00'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">7d Change</p>
                          <p className={`font-medium ${
                            selectedCoin.price_change_percentage_7d_in_currency && selectedCoin.price_change_percentage_7d_in_currency >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {selectedCoin.price_change_percentage_7d_in_currency?.toFixed(2) || '0.00'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                          <p className="font-medium text-gray-900">
                            {formatNumber(selectedCoin.market_cap)}
                          </p>
                        </div>
                      </div>

                      {selectedCoin.sparkline_in_7d?.price && (
                        <div className="pt-4">
                          <p className="text-sm text-gray-500 mb-2">7-Day Price Chart</p>
                          <div className="h-40">
                            <SparklineChart 
                              data={selectedCoin.sparkline_in_7d.price} 
                              positive={getPriceChange(selectedCoin) >= 0}
                              detailed
                            />
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        onClick={handleTradeClick}
                        >
                          
                           
                          Trade {selectedCoin.symbol.toUpperCase()}
                          
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex items-center justify-center p-6">
                  <p className="text-gray-500 text-center">
                    {loading ? 'Loading coin details...' : 'Select a coin to view details'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

// Sparkline Chart Component
const SparklineChart = ({ data, positive, detailed = false }: { data: number[]; positive: boolean; detailed?: boolean }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const normalizedData = data.map(value => (value - min) / (max - min) * 100);

  return (
    <div className={`relative ${detailed ? 'h-full' : 'h-8'}`}>
      <svg 
        viewBox={`0 0 100 ${detailed ? '50' : '20'}`} 
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          fill="none"
          stroke={positive ? '#10B981' : '#EF4444'}
          strokeWidth={detailed ? 2 : 1}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={normalizedData.map((val, i) => `${(i / (normalizedData.length - 1)) * 100},${100 - val}`).join(' ')}
        />
        {detailed && (
          <>
            <line 
              x1="0" 
              y1="0" 
              x2="100" 
              y2="0" 
              stroke="#E5E7EB" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
            <line 
              x1="0" 
              y1="25" 
              x2="100" 
              y2="25" 
              stroke="#E5E7EB" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
            <line 
              x1="0" 
              y1="50" 
              x2="100" 
              y2="50" 
              stroke="#E5E7EB" 
              strokeWidth="0.5" 
              strokeDasharray="2,2"
            />
          </>
        )}
      </svg>
    </div>
  );
};
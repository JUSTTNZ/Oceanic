import { useEffect, useState } from "react";
import {  FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Footer from "../login/footer";
import Header from "../login/header";

interface Transaction {
  id: string;
  date: string;
  status: "confirm" | "pending";  // changed to lowercase
  amount: string;
  type: "buy" | "sell";  // changed to lowercase
  wallet: string;
  currency: string;
}


const statusColors = {
  confirm: "bg-green-100 text-green-800",  
  pending: "bg-red-100 text-red-800",     
};

const typeColors = {
  buy: "text-blue-600",    
  sell: "text-green-300", 
};
interface FormatTransaction {
  id: string;
  date: string;
  status: "confirm" | "pending";  // changed to lowercase
  amount: string;
  type: "buy" | "sell";  // changed to lowercase
  wallet: string;
  currency: string;
  walletAddressUsed:string
  walletAddressSentTo:string
  coin:string
  createdAt:string
  txid:string
}




interface Sort {
  key: keyof Transaction;
  direction: "asc" | "desc";
}

export default function CryptoTransactions() {
  const [sortOrder, setSortOrder] = useState<Sort>({ key: "id", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchTransactions = async () => {
        const token = localStorage.getItem("accessToken");
        try {
          const res = await fetch("https://oceanic-servernz.vercel.app/api/v1/transaction/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await res.json();
          console.log(data)
      const formattedTransactions = data.data.map((tx: FormatTransaction) => ({
          id: tx.txid,
          date: new Date(tx.createdAt).toLocaleDateString(),
          status: tx.status,
          amount: tx.amount?.toString() || "0",
          type: tx.type,
          wallet: tx.walletAddressUsed || tx.walletAddressSentTo,
          currency: tx.coin,
          
        }));
      
      setTransactions(formattedTransactions);
        } catch (err) {
          setError("Failed to fetch transactions");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTransactions();
    }, []);
const filteredTransactions = transactions.filter(tx => {
  const matchesSearch = 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.wallet.toLowerCase().includes(searchTerm.toLowerCase());
  
  
  const matchesStatus = selectedStatus === "All" || tx.status === selectedStatus.toLowerCase();
  const matchesType = selectedType === "All" || tx.type === selectedType.toLowerCase();
  
  return matchesSearch && matchesStatus && matchesType;
});

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const { key, direction } = sortOrder;
    const order = direction === "asc" ? 1 : -1;
    
    // Special sorting for amounts (convert to numbers)
    if (key === "amount") {
      return (parseFloat(a.amount) - parseFloat(b.amount)) * order;
    }
    
    // Default sorting for other fields
    return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Transaction) => {
    setSortOrder(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderSortIcon = (key: keyof Transaction) => {
    if (sortOrder.key !== key) return <FaSort className="ml-1 text-gray-400" />;
    return sortOrder.direction === "asc" ? 
      <FaSortUp className="ml-1" /> : 
      <FaSortDown className="ml-1" />;
  };

  // Add these near the top of your component's return statement
if (loading) {
  return (
    <section className="bg-gray-50 min-h-screen">
      <Header />
      <div className="min-h-screen p-4 pt-20 pb-16 font-grotesk flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
      <Footer />
    </section>
  );
}

if (error) {
  return (
    <section className="bg-gray-50 min-h-screen">
      <Header />
      <div className="min-h-screen p-4 pt-20 pb-16 font-grotesk flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading transactions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      <Footer />
    </section>
  );
}
  return (
   <section className="bg-gray-900">
  <Header />
  <div className="min-h-screen p-4 pt-20 pb-16 font-grotesk">
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Transaction History</h1>
        <p className="text-gray-300">{filteredTransactions.length} transactions found</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by ID or wallet..."
                className="w-full pl-4 pr-10 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              id="status"
              className="w-full pl-3 pr-10 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All" className="bg-gray-800">All Statuses</option>
              <option value="confirm" className="bg-gray-800">Confirm</option>
              <option value="pending" className="bg-gray-800">Pending</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              id="type"
              className="w-full pl-3 pr-10 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All" className="bg-gray-800">All Types</option>
              <option value="buy" className="bg-gray-800">Buy</option>
              <option value="sell" className="bg-gray-800">Sell</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Invoice
                    {renderSortIcon("id")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {renderSortIcon("date")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    {renderSortIcon("type")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {renderSortIcon("amount")}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Wallet Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-400">#{tx.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{tx.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${typeColors[tx.type]}`}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[tx.status]}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-300">
                        ${tx.amount}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.currency.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 font-mono break-all max-w-xs truncate hover:max-w-none">
                        {tx.wallet}
                      </div>
                    </td>
  
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-400">No transactions found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedTransactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium text-gray-300">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{' '}
                  <span className="font-medium text-gray-300">{filteredTransactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">First</span>
                    <FaChevronLeft className="h-3 w-3" />
                    <FaChevronLeft className="h-3 w-3 -ml-1" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-3 w-3" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-gray-600 border-gray-500 text-blue-400'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Last</span>
                    <FaChevronRight className="h-3 w-3" />
                    <FaChevronRight className="h-3 w-3 -ml-1" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  <Footer />
</section>
  );
}
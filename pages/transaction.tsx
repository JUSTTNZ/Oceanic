import { useState } from "react";
import { FaDownload, FaSortUp, FaSortDown } from "react-icons/fa";

const transactions = [
  { id: "011", date: "June 25, 2026", status: "Paid", amount: "$25.00" },
  { id: "010", date: "June 25, 2026", status: "Paid", amount: "$35.00" },
  { id: "009", date: "June 25, 2026", status: "Failed", amount: "$40.00" },
  { id: "008", date: "June 25, 2026", status: "Paid", amount: "$15.00" },
  { id: "007", date: "June 25, 2026", status: "Paid", amount: "$25.00" },
  { id: "006", date: "June 25, 2026", status: "Failed", amount: "$35.00" },
  { id: "005", date: "June 25, 2026", status: "Paid", amount: "$25.00" },
];

export default function CryptoTransactions() {
  const [selected, setSelected] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const order = direction === "asc" ? 1 : -1;
    return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transaction History <span className="text-gray-500">187 Total</span></h2>
        </div>

        <table className="w-full border-collapse">
          <thead className="w-full flex">
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm flex items-center justify-between w-full text-center">
              <th className="p-3 text-left cursor-pointer flex items-center gap-3" onClick={() => handleSort("id")}>Invoice
                <div>
                <span> <FaSortUp/>  </span>
                <span><FaSortDown /></span>
                </div>
              </th>
              <th className="p-3 cursor-pointer flex items-center gap-3 px-6 text-center" onClick={() => handleSort("date")}>Billing Date
                
              <div>
                <span> <FaSortUp/>  </span>
                <span><FaSortDown /></span>
                </div>
                 </th>
              <th className="p-3 cursor-pointer flex items-center gap-3" onClick={() => handleSort("status")}>Status 
              <div>
                <span> <FaSortUp/>  </span>
                <span><FaSortDown /></span>
                </div>
                </th>
              <th className="p-3 cursor-pointer flex items-center gap-3" onClick={() => handleSort("amount")}>Amount
              <div>
                <span> <FaSortUp/>  </span>
                <span><FaSortDown /></span>
                </div>
              </th>
              <th className="p-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="border-b flex justify-between items-center">
                <td className="p-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(tx.id)}
                    onChange={() => toggleSelect(tx.id)}
                  />
                  <span className="text-blue-600 font-semibold">Invoice #{tx.id} - Jun 2026</span>
                </td>
                <td className="p-3 text-center">{tx.date}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${tx.status === "Paid" ? "bg-blue-200 text-blue-600" : "bg-red-200 text-red-600"}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-3 text-center">{tx.amount}</td>
                <td className="p-3 text-center">
                  <FaDownload className="text-gray-500 cursor-pointer hover:text-blue-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button className="text-blue-600">Previous</button>
          <div className="space-x-2">
            {[1, 2, 3, 4, 5, "..."]?.map((num, idx) => (
              <button key={idx} className="px-3 py-1 rounded-md border text-blue-600 border-blue-600">
                {num}
              </button>
            ))}
          </div>
          <button className="text-blue-600">Next</button>
        </div>
      </div>
    </div>
  );
}

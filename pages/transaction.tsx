import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import Footer from "./login/footer";
import Header from "./login/header";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TableSortLabel,
} from "@mui/material";

const transactions = [
    { id: "011", date: "June 25, 2026", status: "Paid", amount: "0.005 BTC", type: "Deposit", wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    { id: "010", date: "June 25, 2026", status: "Paid", amount: "50 USDT", type: "Withdrawal", wallet: "0xAbC12345Ef67890d..." },
    { id: "009", date: "June 25, 2026", status: "Failed", amount: "2 ETH", type: "Swap", wallet: "0xEfG98765Hi43210b..." },
    { id: "008", date: "June 25, 2026", status: "Paid", amount: "0.1 BTC", type: "Purchase", wallet: "bc1qw5kx4m3yn6ydpk..." },
    { id: "007", date: "June 25, 2026", status: "Paid", amount: "75 USDT", type: "Deposit", wallet: "0xDef65432Cba9876..." },
    { id: "006", date: "June 25, 2026", status: "Failed", amount: "1.5 ETH", type: "Withdrawal", wallet: "0xFgh12345Xyz7890..." },
    { id: "005", date: "June 25, 2026", status: "Paid", amount: "200 USDT", type: "Purchase", wallet: "0x123abc456def789..." },
];

interface Sort {
    key: keyof (typeof transactions)[0];
    direction: "asc" | "desc";
}

export default function CryptoTransactions() {
    const [sortOrder, setSortOrder] = useState<Sort>({ key: "id", direction: "asc" });



    const sortedTransactions = [...transactions].sort((a, b) => {
        if (!sortOrder) return 0;
        const { key, direction } = sortOrder;
        const order = direction === "asc" ? 1 : -1;
        return a[key] > b[key] ? order : a[key] < b[key] ? -order : 0;
    });

    const handleSort = (key: keyof (typeof transactions)[0]) => {
        setSortOrder((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <section>
            <Header />
            <div className="min-h-screen bg-[#f7f7fa] p-6 pt-20 pb-20">
                <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    {/* Title Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">
                            Transaction History <span className="text-gray-500">187 Total</span>
                        </h2>
                    </div>

                    {/* Table Wrapper */}
                    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                        <Table stickyHeader>
                            {/* Table Head */}
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortOrder.key === "id"}
                                            direction={sortOrder.key === "id" ? sortOrder.direction : "asc"}
                                            onClick={() => handleSort("id")}
                                        >
                                            Invoice
                                        </TableSortLabel>
                                    </TableCell>
                                    {(["date", "type", "status", "amount", "wallet"] as const).map((key) => (
                                        <TableCell key={key} align="center">
                                            <TableSortLabel
                                                active={sortOrder.key === key}
                                                direction={sortOrder.key === key ? sortOrder.direction : "asc"}
                                                onClick={() => handleSort(key)}
                                            >
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">Download</TableCell>
                                </TableRow>
                            </TableHead>

                            {/* Table Body */}
                            <TableBody>
                                {sortedTransactions.map((tx) => (
                                    <TableRow key={tx.id} hover>
                                        <TableCell>
                                            {/* <Checkbox
                                                checked={selected.includes(tx.id)}
                                                onChange={() => toggleSelect(tx.id)}
                                            /> */}
                                            <span className="text-blue-600 font-semibold">
                                                Invoice #{tx.id} 
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">{tx.date}</TableCell>
                                        <TableCell align="center">{tx.type}</TableCell>
                                        <TableCell align="center">
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs font-bold ${
                                                    tx.status === "Paid"
                                                        ? "bg-blue-200 text-blue-600"
                                                        : "bg-red-200 text-red-600"
                                                }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">{tx.amount}</TableCell>
                                        <TableCell align="center" className="break-all">
                                            {tx.wallet}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton>
                                                <FaDownload className="text-gray-500 hover:text-blue-600" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button className="text-blue-600 px-3 py-1 hover:underline">Previous</button>
                        <div className="space-x-2">
                            {[1, 2, 3, 4, 5, "..."].map((num, idx) => (
                                <button
                                    key={idx}
                                    className="px-3 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button className="text-blue-600 px-3 py-1 hover:underline">Next</button>
                    </div>
                </div>
            </div>

            <Footer />
        </section>
    );
}
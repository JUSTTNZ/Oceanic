import { fetchDeposits, getAccountInfo } from '../services/bitget.service.js';
// Test API connection
export const testConnection = async (req, res) => {
    try {
        const accountInfo = await getAccountInfo();
        res.json({
            success: true,
            message: 'API connection successful',
            data: accountInfo
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'API connection failed',
            details: error.response?.data || error.message
        });
    }
};
export const confirmDeposit = async (req, res) => {
    const { coin, size, txid } = req.query;
    if (!coin || !size || !txid) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters: coin, size, and txid",
        });
    }
    try {
        const expectedSize = parseFloat(size);
        if (isNaN(expectedSize)) {
            return res.status(400).json({
                success: false,
                error: "Invalid size parameter - must be a valid number",
            });
        }
        // Example fixed window (replace with your actual 90d calc)
        const endTime = 1744873600000;
        const startTime = 1744560000000;
        console.log(`Confirming deposit: ${coin} ${size} ${txid}\nTime range: ${new Date(startTime).toISOString()} → ${new Date(endTime).toISOString()}`);
        // Fetch + ensure typing
        const depositsResponse = (await fetchDeposits(coin, startTime, endTime, 100));
        const deposits = depositsResponse.data;
        if (!Array.isArray(deposits)) {
            return res.status(500).json({
                success: false,
                error: "Invalid response format from Bitget API",
            });
        }
        const matchingDeposit = deposits.find((deposit) => {
            const coinMatch = deposit.coin === coin.toUpperCase();
            const sizeMatch = Math.abs(parseFloat(deposit.size) - expectedSize) < 0.000001;
            const txidMatch = deposit.tradeId === txid || deposit.orderId === txid;
            return coinMatch && sizeMatch && txidMatch && deposit.status === "success";
        });
        return res.json({
            success: true,
            confirmed: !!matchingDeposit,
            message: matchingDeposit
                ? "Deposit confirmed successfully"
                : "Deposit not found or does not match criteria",
            data: matchingDeposit || {},
        });
    }
    catch (error) {
        console.error("Error confirming deposit:", error);
        return res.status(500).json({
            success: false,
            confirmed: false,
            error: error.message || "Failed to confirm deposit",
        });
    }
};
// Alternative version with more flexible time range
export const confirmDepositWithTimeRange = async (req, res) => {
    const { coin, size, txid, startTime, endTime } = req.query;
    if (!coin || !size || !txid) {
        return res.status(400).json({
            success: false,
            error: "Missing required parameters: coin, size, and txid",
        });
    }
    try {
        const expectedSize = parseFloat(size);
        if (isNaN(expectedSize)) {
            return res.status(400).json({
                success: false,
                error: "Invalid size parameter - must be a valid number",
            });
        }
        const searchEndTime = endTime ? parseInt(endTime) : Date.now();
        const searchStartTime = startTime
            ? parseInt(startTime)
            : searchEndTime - 7 * 24 * 60 * 60 * 1000;
        console.log(`Confirming deposit (custom range): ${coin} ${size} ${txid}\nTime range: ${new Date(searchStartTime).toISOString()} → ${new Date(searchEndTime).toISOString()}`);
        // Fetch + ensure typing
        const depositsResponse = (await fetchDeposits(coin, searchStartTime, searchEndTime, 100));
        const deposits = depositsResponse.data;
        const matchingDeposit = deposits.find((deposit) => {
            const coinMatch = deposit.coin === coin.toUpperCase();
            const sizeMatch = Math.abs(parseFloat(deposit.size) - expectedSize) < 0.000001;
            const txidMatch = deposit.tradeId === txid || deposit.orderId === txid;
            return coinMatch && sizeMatch && txidMatch && deposit.status === "success";
        });
        return res.json({
            success: true,
            confirmed: !!matchingDeposit,
            message: matchingDeposit
                ? "Deposit confirmed successfully"
                : "Deposit not found or does not match criteria",
            data: matchingDeposit
                ? {
                    deposit: matchingDeposit,
                    verificationDetails: {
                        coin: matchingDeposit.coin,
                        size: matchingDeposit.size,
                        txid: matchingDeposit.tradeId || matchingDeposit.orderId,
                        status: matchingDeposit.status,
                        timestamp: matchingDeposit.cTime,
                    },
                }
                : {
                    searchCriteria: { coin, size: expectedSize, txid },
                    totalDepositsSearched: deposits.length,
                },
        });
    }
    catch (error) {
        console.error("Error confirming deposit:", error);
        return res.status(500).json({
            success: false,
            confirmed: false,
            error: error.message || "Failed to confirm deposit",
        });
    }
};
// Get deposit records
export const getDeposits = async (req, res) => {
    const { coin, startTime, endTime, limit } = req.query;
    // Validate required parameters
    if (!coin) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameter: coin'
        });
    }
    if (!startTime || !endTime) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters: startTime and endTime (in milliseconds)'
        });
    }
    try {
        const deposits = await fetchDeposits(coin, parseInt(startTime), parseInt(endTime), limit ? parseInt(limit) : 20);
        res.json({
            success: true,
            data: deposits
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch deposits',
            details: error.response?.data || error.message
        });
    }
};
// Get recent deposits (last 24 hours) - convenience endpoint
export const getRecentDeposits = async (req, res) => {
    const { coin, limit } = req.query;
    if (!coin) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameter: coin'
        });
    }
    try {
        const endTime = Date.now();
        const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
        const deposits = await fetchDeposits(coin, startTime, endTime, limit ? parseInt(limit) : 20);
        res.json({
            success: true,
            timeRange: {
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString()
            },
            data: deposits
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recent deposits',
            details: error.response?.data || error.message
        });
    }
};
//# sourceMappingURL=webhook.controller.js.map
"use strict";
// controllers/poll.controller.ts
// import { Request, Response } from 'express';
// import { matchTxidInBitget } from '../services/poll.service.js';
// // Cache configuration
// const responseCache = new Map();
// const CACHE_TTL = 30000; // 30 seconds cache
// export const pollTxidStatus = async (req: Request, res: Response) => {
//   const { txid, coin } = req.query;
//   if (!txid || !coin) {
//     return res.status(400).json({ 
//       success: false,
//       message: 'Both txid and coin parameters are required',
//       error: 'MISSING_PARAMETERS'
//     });
//   }
//   const cacheKey = `${txid}:${coin}`;
//   try {
//     // Check cache first
//     if (responseCache.has(cacheKey)) {
//       const cached = responseCache.get(cacheKey);
//       if (Date.now() - cached.timestamp < CACHE_TTL) {
//         return res.status(200).json(cached.data);
//       }
//     }
//     const status = await matchTxidInBitget(txid.toString(), coin.toString());
//     // Cache the response
//     const responseData = {
//       success: true,
//       status,
//       txid: txid.toString(),
//       coin: coin.toString(),
//       timestamp: Date.now()
//     };
//     responseCache.set(cacheKey, {
//       data: responseData,
//       timestamp: Date.now()
//     });
//     return res.status(200).json(responseData);
//   } catch (error: any) {
//     console.error("Polling error:", error);
//     // Return more detailed error information
//     return res.status(500).json({ 
//       success: false,
//       message: error.message || 'Failed to poll status',
//       error: 'POLLING_ERROR',
//       details: error.response?.data || null
//     });
//   }
// };
//# sourceMappingURL=poll.controller.js.map
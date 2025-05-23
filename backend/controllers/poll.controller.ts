import { Request, Response } from 'express';
import { matchTxidInBitget } from '../services/poll.service.js';

export const pollTxidStatus = async (req: Request, res: Response) => {
  const { txid, coin } = req.query;
  if (!txid || !coin) return res.status(400).json({ message: 'TXID and coin are required' });

  try {
    const status = await matchTxidInBitget(txid.toString(), coin.toString());
    return res.json({ status });
  } catch (error) {
    console.error("Polling error:", error);
    return res.status(500).json({ message: 'Failed to poll status' });
  }
};
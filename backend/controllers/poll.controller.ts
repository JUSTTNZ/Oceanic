import { Request, Response } from 'express';
import { matchTxidInBitget } from '../services/poll.service.js';

export const pollTxidStatus = async (req: Request, res: Response) => {
  const { txid, coin } = req.query;
  console.log('txid', txid)
   console.log('txid', coin)
  if (!txid || !coin) return res.status(400).json({ message: 'TXID and coin are required' });

  try {
    const status = await matchTxidInBitget(txid.toString(), coin.toString());
    console.log("status",status)
       return res.status(200).json({ 
      success: true,
      status,
      txid: txid.toString(),
      coin: coin.toString()
    });
  } catch (error) {
    console.error("Polling error:", error);
    return res.status(500).json({ message: 'Failed to poll status' });
  }
};
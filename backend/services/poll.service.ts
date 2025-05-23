import { fetchRecentDeposits } from './bitget.service.js';

export const matchTxidInBitget = async (txid: string, coin: string): Promise<'confirmed' | 'not_found'> => {
  const result = await fetchRecentDeposits();
  const found = result.find((tx: any) => tx.txId === txid);
  return found ? 'confirmed' : 'not_found';
};
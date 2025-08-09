// services/poll.service.ts
// import { fetchRecentDeposits } from './bitget.service.js';
export {};
// export const matchTxidInBitget = async (txid: string, coin: string): Promise<'confirmed' | 'pending'> => {
//   try {
//     const result = await fetchRecentDeposits();
//     if (!Array.isArray(result)) {
//       throw new Error('Invalid response format from Bitget API');
//     }
//     const found = result.find((tx: any) => 
//       tx.txId === txid && 
//       tx.coin?.toUpperCase() === coin.toUpperCase()
//     );
//     return found ? 'confirmed' : 'pending';
//   } catch (error) {
//     console.error('Error matching txid:', error);
//     throw error;
//   }
// };
//# sourceMappingURL=poll.service.js.map
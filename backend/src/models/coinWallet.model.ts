import mongoose, { Schema, Document } from 'mongoose';

interface CoinWalletDocument extends Document {
  coin: string; // e.g. BTC, ETH
  walletAddress: string; // wallet address
  network?: string; // optional: TRC20, ERC20, BTC, etc.
}

const coinWalletSchema = new Schema<CoinWalletDocument>(
  {
    coin: { type: String, required: true, unique: true },
    network: { type: String },
    walletAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export const CoinWallet = mongoose.model<CoinWalletDocument>('CoinWallet', coinWalletSchema, 'coinWallets');

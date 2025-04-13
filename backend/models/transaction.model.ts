// models/transaction.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  coin: string;
  amount: number;
  txid: string;
  status: 'pending' | 'confirmed' | 'paid';
  type: 'buy' | 'sell';
  walletAddressSentTo?: string;
  walletAddressUsed?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    txid: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'confirmed', 'paid'], default: 'pending' },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    walletAddressSentTo: { type: String },
    walletAddressUsed: { type: String },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

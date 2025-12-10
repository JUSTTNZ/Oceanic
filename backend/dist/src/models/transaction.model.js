// Enhanced transaction.model.ts with bank details
import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userFullname: { type: String, required: true },
    userUsername: { type: String, required: true },
    userEmail: { type: String, required: true },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    txid: { type: String, required: true, unique: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    country: { type: String, required: true },
    walletAddressUsed: { type: String },
    walletAddressSentTo: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'paid'], default: 'pending' },
}, { timestamps: true });
export const Transaction = mongoose.model('Transaction', TransactionSchema);
//# sourceMappingURL=transaction.model.js.map
import mongoose, { Schema } from 'mongoose';
const coinWalletSchema = new Schema({
    coin: { type: String, required: true, unique: true },
    network: { type: String },
    walletAddress: { type: String, required: true },
}, { timestamps: true });
export const CoinWallet = mongoose.model('CoinWallet', coinWalletSchema, 'coinWallets');
//# sourceMappingURL=coinWallet.model.js.map
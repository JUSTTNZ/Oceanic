import mongoose from 'mongoose';
import { CoinWallet } from './models/coinWallet.model.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  const wallets = await CoinWallet.find({});
  console.log("Wallets:", wallets);
  process.exit(0);
})();

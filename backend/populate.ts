import mongoose from 'mongoose';
import { CoinWallet } from './models/coinWallet.model.js';
import coinData from './coindata/coin.json' with { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
};

const populateCoins = async () => {
  try {
    await connectDB();
    await CoinWallet.deleteMany();
    const result = await CoinWallet.insertMany(coinData);
    console.log("Coins seeded:", result.length);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding coins:", err);
    process.exit(1);
  }
};

populateCoins();

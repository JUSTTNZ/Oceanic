// import mongoose from 'mongoose';
// import { CoinWallet } from './src/models/coinWallet.model.js';
// import coinData from './coindata/coinData.js'; 
// import dotenv from 'dotenv';

// dotenv.config();
// const DB_NAME = 'Oceanic_Charts';

// const connectDB = async () => {
//   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//   console.log("MongoDB connected successfully");
// };

// const populateCoins = async () => {
//   try {
//     await connectDB();
//     await CoinWallet.deleteMany();
//     const result = await CoinWallet.insertMany(coinData, { ordered: false });
//     console.log("Coins seeded:", result.length);
//     console.log("Coin data:", coinData);
//     console.log("Connected to DB:", mongoose.connection.name);

  
//     process.exit(0);
//   } catch (err) {
//     console.error("Error seeding coins:", err);
//     process.exit(1);
//   }
// };

// populateCoins();

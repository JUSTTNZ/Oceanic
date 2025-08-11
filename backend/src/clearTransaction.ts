import 'dotenv/config';
import mongoose from 'mongoose';

const DB_NAME = 'Oceanic_Charts';

async function main() {
  try {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    await mongoose.connect(uri);
    const result = await mongoose.connection
      .collection('transactions')
      .deleteMany({}); // keep collection, clear docs
    console.log(`✅ Cleared ${result.deletedCount} transactions`);
  } catch (err) {
    console.error('❌ Error clearing transactions:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();

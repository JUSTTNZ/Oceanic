import mongoose from 'mongoose'
import { DB_NAME } from '../constant.ts'

const connectDB = async () => {
    try {
        //console.log('🔍 MONGO_URI:', process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(` \n MongoDB connected ! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectDB
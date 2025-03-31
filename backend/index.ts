import dotenv from 'dotenv'
import { app } from './app.ts'
import connectDB from './config/db.ts'

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the .env file from backend folder
dotenv.config({ path: join(__dirname, '.env') });
//console.log('Loaded ENV VARS:', process.env);

const PORT = process.env.PORT || 7001

connectDB()

.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        
    })
})
.catch((err) => {
    console.log("Error in starting server", err);
    process.exit(1);
})
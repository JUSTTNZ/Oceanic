import dotenv from 'dotenv'
import { app, server } from './app.js'
import connectDB from './config/db.js'

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initSocket } from './config/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the .env file from backend folder
dotenv.config({ path: join(__dirname, '.env') });
//console.log('Loaded ENV VARS:', process.env);

const PORT = process.env.PORT || 7001

connectDB()
//console.log("This should print after the DB connection is established")
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        initSocket(server);
    })
})
.catch((err) => {
    console.log("Error in starting server", err);
    process.exit(1);
})
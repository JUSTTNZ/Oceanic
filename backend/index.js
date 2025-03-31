import dotenv from 'dotenv'
import { app } from './app.js'
import connectDB from './config/db.js'

dotenv.config({
    path: './.env'
})

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
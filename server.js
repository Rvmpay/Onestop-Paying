import express from 'express';
import dotenv from 'dotenv';
import upiRoutes from './routes/upitranscation.route.js';
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use("/api/v1/pg",upiRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    connectDB()
})
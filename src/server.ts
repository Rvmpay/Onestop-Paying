import express, { Application } from 'express';
import dotenv from 'dotenv';
import upiRoutes from './routes/upitranscation.route';
import connectDB from './lib/db';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use('/api/v1/pg', upiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  connectDB();
});

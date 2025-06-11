import express, { Application } from 'express';
import dotenv from 'dotenv';
import upiRoutes from './routes/upitranscation.route';
import cors from 'cors';
import connectDB from './lib/db';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));
app.use('/api/v1/pg', upiRoutes);
app.use('/api/v1/payout', upiRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Catch-all route for undefined paths
app.all('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

(async () => {
  await connectDB();                        // connect once at startup
  app.listen(PORT, '192.168.1.9', () => {
    console.log(`Server is running on http://192.168.1.9:${PORT}`);
  });  
})();

export default app;
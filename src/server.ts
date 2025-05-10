import express, { Application } from 'express';
import dotenv from 'dotenv';
import upiRoutes from './routes/upitranscation.route';
import connectDB from './lib/db';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
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

if (process.env.NETLIFY_DEV !== 'true') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    connectDB();
  });
}

export default app;
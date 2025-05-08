import express from 'express';
import serverless from 'serverless-http';
import upiRoutes from '../routes/upitranscation.route'; // adjust path

const app = express();
app.use(express.json());

app.use('/api/v1/pg', upiRoutes);
app.use('/api/v1/payout', upiRoutes);

app.get('/health', (req, res) => {
  res.send('API is alive');
});

export const handler = serverless(app);

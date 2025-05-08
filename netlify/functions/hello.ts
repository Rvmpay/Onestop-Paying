import express from 'express';
import serverless from 'serverless-http';
import upiRoutes from '../../src/routes/upitranscation.route'; // Adjust path if needed

const app = express();
app.use(express.json());

// Adjust base path for Netlify
const router = express.Router();
router.use('/api/v1/pg', upiRoutes);
router.use('/api/v1/payout', upiRoutes);

router.get('/health', (req, res) => {
  res.send('API is alive');
});

app.use('/.netlify/functions/hello', router); // Add Netlify function prefix

// Export serverless handler
export const handler = serverless(app);
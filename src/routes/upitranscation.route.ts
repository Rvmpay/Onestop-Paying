import express from 'express';
import initialUPI from '../controller/Upitranscation.controller';

const router = express.Router();

router.post('/upi/initiate', async (req, res, next) => {
  try {
    await initialUPI.initiateUPIInstant(req, res, next);
  } catch (error) {
    res.status(500).json({ 
    message: 'Error initiating UPI request',
    error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

router.post('/checkTxnStatus', async (req, res) => {
  try {
    await initialUPI.checkTxnStatus(req, res);
  } catch (error) {
    res.status(500).json({ 
      message: "Error checking transaction status", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

router.post('/initiatePayout', async (req, res) => {
    try {
      await initialUPI.initiatePayout(req, res);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error initiating payout',
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });


  router.post('/initiateBulkPayout', async (req, res) => {
    try {
      await initialUPI.initiateBulkPayout(req, res);
      await initialUPI.initiateBulkPayout(req, res);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error initiating bulk payout',
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  

export default router;

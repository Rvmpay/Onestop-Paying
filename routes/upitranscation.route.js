import express from 'express';
import initialUPI from '../controllers/upitranscation.controller.js';


const router = express.Router();

router.post('/upi/initiate', initialUPI.initiateUPIInstant);

router.post('/checkTxnStatus', initialUPI.checkTxnStatus);

export default router;
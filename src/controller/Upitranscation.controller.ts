import { Request, Response } from 'express';
import UpiTransaction from '../models/UpiTransaction.model';
import generateChecksum from '../utils/checksum';


export interface InitiateUPIRequestBody {
    merchantTransactionId: string;
    amount: number;
    name: string;
    mobile: string;
    channel: string;
    checksum: string;
  }
  
  export interface CheckTxnStatusRequestBody {
    merchantTransactionId: string;
  }

export const initiateUPIInstant = async (
req: Request<{}, {}, InitiateUPIRequestBody>, res: Response, next: unknown): Promise<Response> => {
  try {
    const {
      merchantTransactionId,
      amount,
      name,
      mobile,
      channel,
      checksum
    } = req.body;

    const merchantId = req.header('X-MERCHANT-ID');
    const merchantKey = req.header('X-MERCHANT-KEY');

    if (!merchantId || !merchantKey) {
      return res.status(400).json({
        code: "1",
        msg: "Missing merchant headers",
        data: { error: "Missing headers" }
      });
    }

    if (!merchantTransactionId || !amount || !name || !mobile || !channel || !checksum) {
      return res.status(400).json({
        code: "1",
        msg: "Missing required fields",
        data: { error: "Missing body parameters" }
      });
    }

    if (merchantTransactionId.length > 18) {
      return res.status(400).json({
        code: "1",
        msg: "Transaction ID too long",
        data: { error: "Transaction ID exceeds 18 characters" }
      });
    }

    const dataString = `${merchantId}|${merchantTransactionId}|${amount}|${channel}|${name}|${mobile}`;
    const expectedChecksum = generateChecksum(dataString, merchantKey);
    console.log("Expected Checksum:", expectedChecksum);

    if (checksum !== expectedChecksum) {
      return res.status(401).json({
        code: "1",
        msg: "Invalid checksum",
        data: { error: "Checksum validation failed" }
      });
    }

    const apitxnid = `2TXNP${Date.now()}`;
    const tid = `SUR${Math.floor(Math.random() * 1_000_000_000_000)}`;

    const paymentUrl = `upi://pay?cu=INR&pa=onestopshopping@suryoday&pn=ONE STOP SHOPPING STATION PVT LTD&am=${amount}&tid=${tid}&tr=${merchantTransactionId}&mc=5816&tn=${merchantTransactionId}`;

    const transaction = new UpiTransaction({
      merchantTransactionId,
      amount,
      name,
      mobile,
      channel,
      checksum,
      merchantId,
      tid,
      apitxnid,
      paymentUrl
    });

    await transaction.save();

    return res.status(200).json({
      code: "0",
      msg: "Processed",
      data: {
        error: "",
        message: "Payment request initiated successfully.",
        merchantTransactionId,
        apitxnid,
        amount: amount.toFixed(2),
        paymentUrl
      }
    });

  } catch (error: any) {
    console.error('Error initiating UPI:', error);
    return res.status(500).json({
      code: "1",
      msg: "Server error",
      data: { error: error.message || "Unexpected error" }
    });
  }
};


export const checkTxnStatus = async (
  req: Request<{}, {}, CheckTxnStatusRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { merchantTransactionId } = req.body;
    const merchantId = req.header('X-MERCHANT-ID');
    const merchantKey = req.header('X-MERCHANT-KEY');

    if (!merchantId || !merchantKey) {
      return res.status(400).json({
        code: "1",
        msg: "Missing headers",
        data: { error: "Missing X-MERCHANT-ID or X-MERCHANT-KEY" }
      });
    }

    if (!merchantTransactionId) {
      return res.status(400).json({
        code: "1",
        msg: "Missing body",
        data: { error: "merchantTransactionId is required" }
      });
    }

    const txn = await UpiTransaction.findOne({ merchantTransactionId });

    if (!txn) {
      return res.status(404).json({
        code: "1",
        msg: "Not Found",
        data: { error: "Transaction not found" }
      });
    }

    const response = {
      code: "0",
      msg: "Processed",
      data: {
        merchantTransactionId: txn.merchantTransactionId,
        apitxnid: txn.apitxnid || `2TXNP${Date.now()}`,
        txnrefid: txn.tid || `SUR9${Math.floor(Math.random() * 1_000_000_000_000_000)}`,
        bankref: txn.bankref || "423456116",
        amount: txn.amount.toFixed(2),
        payin_mode: "PT1",
        txn_status: "1",
        payin_status: "SUCCESS",
        payin_msg: "SUCCESS",
        payee_vpa: "test@oksbi",
        payee_account_name: "Test User",
        payee_account_no: "15660070443",
        payee_ifsc: "IBKL0000222"
      }
    };

    return res.status(200).json(response);

  } catch (err: any) {
    console.error("Error checking transaction status:", err);
    return res.status(500).json({
      code: "1",
      msg: "Server Error",
      data: { error: err.message || "Unexpected error" }
    });
  }
};

export default {
  initiateUPIInstant,
  checkTxnStatus
};

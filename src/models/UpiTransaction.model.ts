import mongoose, { Document, Schema } from 'mongoose';

interface IUpiTransaction extends Document {
  merchantTransactionId: string;
  amount: number;
  name: string;
  mobile: string;
  channel: string;
  checksum: string;
  merchantId: string;
  apitxnid?: string;
  tid?: string;
  paymentUrl?: string;
  bankref?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const upiTransactionSchema = new mongoose.Schema({
    merchantTransactionId: { type: String, required: true, maxlength: 18, unique: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    channel: { type: String, required: true },
    checksum: { type: String, required: true },
    merchantId: { type: String, required: true },
    apitxnid: { type: String },
    tid: { type: String },
    paymentUrl: { type: String },
    bankref: { type: String },
  }, { timestamps: true });
  


const UpiTransaction = mongoose.model<IUpiTransaction>('UpiTransaction', upiTransactionSchema);
export default UpiTransaction;

import mongoose from "mongoose";


const upiTransactionSchema = new mongoose.Schema({
    merchantTransactionId: {
      type: String,
      required: true,
      maxlength: 18,
      unique: true
    },
    amount: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    },
    checksum: {
      type: String,
      required: true
    },
    merchantId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const UpiTransaction  = mongoose.model('UpiTransaction', upiTransactionSchema);

  export default UpiTransaction
  

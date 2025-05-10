"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const upiTransactionSchema = new mongoose_1.default.Schema({
    merchantTransactionId: { type: String, required: true, maxlength: 18, unique: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    payoutType: { type: String },
    beneficiaryVPA: { type: String },
    beneficiaryAccount: { type: String },
    beneficiaryIFSC: { type: String },
    mobile: { type: String, required: true },
    channel: { type: String, required: true },
    checksum: { type: String, required: true },
    merchantId: { type: String, required: true },
    apitxnid: { type: String },
    tid: { type: String },
    paymentUrl: { type: String },
    bankref: { type: String },
}, { timestamps: true });
const UpiTransaction = mongoose_1.default.model('UpiTransaction', upiTransactionSchema);
exports.default = UpiTransaction;

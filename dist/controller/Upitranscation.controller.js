"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateBulkPayout = exports.initiatePayout = exports.checkTxnStatus = exports.initiateUPIInstant = void 0;
const UpiTransaction_model_1 = __importDefault(require("../models/UpiTransaction.model"));
const checksum_1 = __importDefault(require("../utils/checksum"));
const initiateUPIInstant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { merchantTransactionId, amount, name, mobile, channel, checksum } = req.body;
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
        const expectedChecksum = (0, checksum_1.default)(dataString, merchantKey);
        console.log("Expected Checksum:", expectedChecksum);
        if (checksum !== expectedChecksum) {
            return res.status(401).json({
                code: "1",
                msg: "Invalid checksum",
                data: { error: "Checksum validation failed" }
            });
        }
        const apitxnid = `2TXNP${Date.now()}`;
        const tid = `SUR${Math.floor(Math.random() * 1000000000000)}`;
        const paymentUrl = `upi://pay?cu=INR&pa=onestopshopping@suryoday&pn=ONE STOP SHOPPING STATION PVT LTD&am=${amount}&tid=${tid}&tr=${merchantTransactionId}&mc=5816&tn=${merchantTransactionId}`;
        const transaction = new UpiTransaction_model_1.default({
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
        yield transaction.save();
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
    }
    catch (error) {
        console.error('Error initiating UPI:', error);
        return res.status(500).json({
            code: "1",
            msg: "Server error",
            data: { error: error.message || "Unexpected error" }
        });
    }
});
exports.initiateUPIInstant = initiateUPIInstant;
const checkTxnStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const txn = yield UpiTransaction_model_1.default.findOne({ merchantTransactionId });
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
                txnrefid: txn.tid || `SUR9${Math.floor(Math.random() * 1000000000000000)}`,
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
    }
    catch (err) {
        console.error("Error checking transaction status:", err);
        return res.status(500).json({
            code: "1",
            msg: "Server Error",
            data: { error: err.message || "Unexpected error" }
        });
    }
});
exports.checkTxnStatus = checkTxnStatus;
const initiatePayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { merchantTransactionId, amount, channel, payoutType, beneficiaryVPA, beneficiaryAccount, beneficiaryIFSC, name, mobile, payoutRemark, checksum, } = req.body;
        const merchantId = req.header('X-MERCHANT-ID');
        const merchantKey = req.header('X-MERCHANT-KEY');
        if (!merchantId || !merchantKey) {
            return res.status(400).json({
                code: '1',
                msg: 'Missing merchant headers',
                data: { error: 'Missing X-MERCHANT-ID or X-MERCHANT-KEY' },
            });
        }
        if (!merchantTransactionId ||
            !amount ||
            !channel ||
            !payoutType ||
            !name ||
            !mobile ||
            !payoutRemark ||
            !checksum) {
            return res.status(400).json({
                code: '1',
                msg: 'Missing required fields',
                data: { error: 'Required body parameters missing' },
            });
        }
        if (merchantTransactionId.length > 18) {
            return res.status(400).json({
                code: '1',
                msg: 'Transaction ID too long',
                data: { error: 'Transaction ID exceeds 18 characters' },
            });
        }
        if (payoutType === 'UPI' && !beneficiaryVPA) {
            return res.status(400).json({
                code: '1',
                msg: 'Missing VPA for UPI payout',
                data: { error: 'beneficiaryVPA is required for UPI' },
            });
        }
        if (payoutType === 'IMPS' && (!beneficiaryAccount || !beneficiaryIFSC)) {
            return res.status(400).json({
                code: '1',
                msg: 'Missing account/IFSC for IMPS payout',
                data: { error: 'beneficiaryAccount and beneficiaryIFSC are required for IMPS' },
            });
        }
        // Validate checksum
        const dataString = `${merchantId}|${merchantTransactionId}|${amount}|${channel}|${payoutType}|${name}|${mobile}`;
        const expectedChecksum = (0, checksum_1.default)(dataString, merchantKey);
        console.log('Expected Checksum:', expectedChecksum);
        if (checksum !== expectedChecksum) {
            return res.status(401).json({
                code: '1',
                msg: 'Invalid checksum',
                data: { error: 'Checksum validation failed' },
            });
        }
        const apitxnid = `AP${Date.now()}`;
        const bankref = `BR${Math.floor(Math.random() * 1000000000000)}`;
        const payoutTxn = new UpiTransaction_model_1.default({
            merchantTransactionId,
            amount,
            channel,
            payoutType,
            beneficiaryVPA,
            beneficiaryAccount,
            beneficiaryIFSC,
            name,
            mobile,
            payoutRemark,
            checksum,
            merchantId,
            apitxnid,
            bankref,
        });
        yield payoutTxn.save();
        return res.status(200).json({
            code: '0',
            msg: 'Success',
            data: {
                error: '',
                message: 'Payout initiated successfully.',
                merchantTransactionId,
                apitxnid,
                bankref,
                amount: amount.toFixed(2),
                payout_mode: payoutType,
                name: name,
                account_no: beneficiaryAccount !== null && beneficiaryAccount !== void 0 ? beneficiaryAccount : '',
                ifsc: beneficiaryIFSC !== null && beneficiaryIFSC !== void 0 ? beneficiaryIFSC : '',
                mobile: mobile,
                vpa: beneficiaryVPA !== null && beneficiaryVPA !== void 0 ? beneficiaryVPA : '',
                txn_status: '1',
                payout_status: 'Success',
                payout_msg: 'Payout initiated successfully.',
            },
        });
    }
    catch (error) {
        console.error('Error initiating payout:', error);
        return res.status(500).json({
            code: '1',
            msg: 'Server error',
            data: { error: error.message || 'Unexpected error' },
        });
    }
});
exports.initiatePayout = initiatePayout;
const initiateBulkPayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bulkBatchRefId, payouts } = req.body;
        if (!bulkBatchRefId || !Array.isArray(payouts) || payouts.length === 0) {
            return res.status(400).json({
                code: '1',
                msg: 'Invalid input',
                data: { error: 'Missing bulkBatchRefId or payout list is empty' },
            });
        }
        if (bulkBatchRefId.length > 18) {
            return res.status(400).json({
                code: '1',
                msg: 'batchRefId too long',
                data: { error: 'batchRefId exceeds 18 characters' },
            });
        }
        let addedToBatch = 0;
        let failedToBatch = 0;
        for (const payout of payouts) {
            try {
                const { merchantTransactionId, amount, beneficiaryAccount, beneficiaryIFSC, beneficiaryName, beneficiaryMobNo, payoutRemark, payoutMode, beneficiaryVPA, } = payout;
                if (!merchantTransactionId ||
                    !amount ||
                    !beneficiaryAccount ||
                    !beneficiaryIFSC ||
                    !beneficiaryName ||
                    !beneficiaryMobNo ||
                    !payoutRemark ||
                    !payoutMode) {
                    failedToBatch++;
                    continue;
                }
                const txn = new UpiTransaction_model_1.default({
                    bulkBatchRefId,
                    merchantTransactionId,
                    amount,
                    beneficiaryAccount,
                    beneficiaryIFSC,
                    beneficiaryName,
                    beneficiaryMobNo,
                    payoutRemark,
                    payoutMode,
                    beneficiaryVPA,
                    status: 'PENDING',
                });
                yield txn.save();
                addedToBatch++;
            }
            catch (error) {
                console.error('Failed to save one payout:', error);
                failedToBatch++;
            }
        }
        return res.status(200).json({
            code: '0',
            msg: 'Processed',
            data: {
                total_payouts: payouts.length,
                added_to_batch: addedToBatch,
                failed_to_batch: failedToBatch,
            },
        });
    }
    catch (error) {
        console.error('Bulk payout error:', error);
        return res.status(500).json({
            code: '1',
            msg: 'Server error',
            data: { error: error.message || 'Unexpected error' },
        });
    }
});
exports.initiateBulkPayout = initiateBulkPayout;
exports.default = {
    initiateUPIInstant: exports.initiateUPIInstant,
    checkTxnStatus: exports.checkTxnStatus,
    initiatePayout: exports.initiatePayout,
    initiateBulkPayout: exports.initiateBulkPayout
};

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
const express_1 = __importDefault(require("express"));
const Upitranscation_controller_1 = __importDefault(require("../controller/Upitranscation.controller"));
const router = express_1.default.Router();
router.post('/upi/initiate', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Upitranscation_controller_1.default.initiateUPIInstant(req, res, next);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error initiating UPI request',
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}));
router.post('/checkTxnStatus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Upitranscation_controller_1.default.checkTxnStatus(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Error checking transaction status",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}));
router.post('/initiatePayout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Upitranscation_controller_1.default.initiatePayout(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error initiating payout',
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}));
router.post('/initiateBulkPayout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Upitranscation_controller_1.default.initiateBulkPayout(req, res);
        yield Upitranscation_controller_1.default.initiateBulkPayout(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error initiating bulk payout',
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}));
exports.default = router;

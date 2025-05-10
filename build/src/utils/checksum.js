"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function generateChecksum(dataString, merchantKey) {
    return (0, crypto_1.createHmac)('sha256', merchantKey).update(dataString).digest('hex');
}
exports.default = generateChecksum;

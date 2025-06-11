"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const upitranscation_route_1 = __importDefault(require("../../src/routes/upitranscation.route")); // adjust path
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/pg', upitranscation_route_1.default);
app.use('/api/v1/payout', upitranscation_route_1.default);
app.get('/health', (req, res) => {
    res.send('API is alive');
});
exports.handler = (0, serverless_http_1.default)(app);

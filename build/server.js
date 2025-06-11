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
const dotenv_1 = __importDefault(require("dotenv"));
const upitranscation_route_1 = __importDefault(require("./routes/upitranscation.route"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./lib/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
}));
app.use('/api/v1/pg', upitranscation_route_1.default);
app.use('/api/v1/payout', upitranscation_route_1.default);
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});
// Catch-all route for undefined paths
app.all('/api', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)(); // connect once at startup
    app.listen(PORT, '192.168.1.9', () => {
        console.log(`Server is running on http://192.168.1.9:${PORT}`);
    });
}))();
exports.default = app;

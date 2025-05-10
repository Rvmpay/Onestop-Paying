"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const upitranscation_route_1 = __importDefault(require("./routes/upitranscation.route"));
const db_1 = __importDefault(require("./lib/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
app.use(express_1.default.json());
app.use('/api/v1/pg', upitranscation_route_1.default);
app.use('/api/v1/payout', upitranscation_route_1.default);
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});
// Catch-all route for undefined paths
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
if (process.env.NETLIFY_DEV !== 'true') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
        (0, db_1.default)();
    });
}
exports.default = app;

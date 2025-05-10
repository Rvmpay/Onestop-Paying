"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_http_1 = __importDefault(require("serverless-http"));
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("../src/server"));
// Ensure body parsing works in serverless environments
server_1.default.use(express_1.default.json());
exports.handler = (0, serverless_http_1.default)(server_1.default);

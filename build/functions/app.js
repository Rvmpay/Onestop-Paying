"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// netlify/functions/app.ts
const serverless_http_1 = __importDefault(require("serverless-http"));
const server_1 = __importDefault(require("../src/server"));
exports.handler = (0, serverless_http_1.default)(server_1.default);
// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
// import express, { Router } from "express";
// import serverless from "serverless-http";
// import app from '../src/server';
// const api = express();
// const router = Router();
// router.get("/hello", (req, res) => {
// 	res.send("Hello World!");
// });
// api.use("/api/", router);
// export const handler = serverless(app);

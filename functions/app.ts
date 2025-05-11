import serverless from 'serverless-http';
import express from 'express';
import server from '../src/server';
import cors from 'cors';
const app = express();

app.use(cors({
  origin: 'https://onestop-api.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

export const handler = serverless(server);
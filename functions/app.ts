import serverless from 'serverless-http';
import express from 'express';
import app from '../src/server';

// Ensure body parsing works in serverless environments
app.use(express.json());

export const handler = serverless(app);
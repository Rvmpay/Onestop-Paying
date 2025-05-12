// netlify/functions/app.ts
import serverless from 'serverless-http';
import app from '../src/server';

export const handler = serverless(app);



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

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './utils/swagger.js';
import connectDB from './utils/mongodb.js';

import ticketRoute from "./routes/ticketRoute.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());

const PORT = process.env.PORT;
connectDB();

const allowedOrigins = ['']

app.use("/service/ticket", ticketRoute)

// api documentation endpoint
app.use("/helpDesk/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "HelpDesk Management API",
}))

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));
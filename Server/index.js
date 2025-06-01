import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import ticketRoute from "./routes/ticketRoute.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;

app.use("/service/ticket", ticketRoute)

mongoose.set("strictQuery", true)

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
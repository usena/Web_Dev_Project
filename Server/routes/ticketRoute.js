import express from 'express';
import {createTicket} from '../controllers/ticket.js';

const router = express.Router()

router.post("/add_ticket", createTicket)

export default router
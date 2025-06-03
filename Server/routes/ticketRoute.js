import express from 'express';
import {createTicket, draftResponseStaff, submitResponseStaff, getAllTicketsStaff, getSpecificTicketStaff, getSpecificTicketClient} from '../controllers/ticket.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Tickets
 *     description: Tickets related operations
 */

/**
 * @openapi
 * /add_ticket:
 *   post:
 *     tags:
 *       - Ticket
 *     summary: Add a new ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketTitle:
 *                 type: string
 *                 example: "Flight Missed"
 *               ticketCategory:
 *                 type: string
 *                 example: "other"
 *               ticketDesc:
 *                 type: string
 *                 example: "I missed my flight. Can I ask for a refund?"
 *     responses:
 *       '200':
 *         description: Add ticket successfully
 *       '403':
 *         description: Requested resource is forbidden
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/add_ticket", createTicket)

/**
 * @openapi
 * /draft_ticket/{id}:
 *   patch:
 *     tags:
 *       - Ticket
 *     summary: Updating and drafting ticket (Staff Only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Ticket ID
 *         schema:
 *           type: string
 *           example: ""
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketCategory:
 *                 type: string
 *                 enum: ["technical", "complain", "inquiries", "booking"]
 *                 example: "technical"
 *               ticketDeadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               ticketResponse:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "We've fixed the reported issue."
 *     responses:
 *       '200':
 *         description: Ticket updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Ticket Not Found
 *       '500':
 *         description: Internal server error
 */
router.patch("/draft_ticket/:id", draftResponseStaff)

/**
 * @openapi
 * /submit_response/{id}:
 *   patch:
 *     tags:
 *       - Ticket
 *     summary: Submitting response or solution to the ticket (Staff Only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Ticket ID
 *         schema:
 *           type: string
 *           example: ""
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketCategory:
 *                 type: string
 *                 enum: ["technical", "complain", "inquiries", "booking"]
 *                 example: "technical"
 *               ticketDeadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               ticketResponse:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "We've fixed the reported issue."
 *     responses:
 *       '200':
 *         description: Ticket updated
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Ticket Not Found
 *       '500':
 *         description: Internal server error
 */
router.patch("/submit_response/:id", submitResponseStaff)

/**
 * @openapi
 * /get_all_tickets:
 *   get:
 *     tags:
 *       - Ticket
 *     summary: Get all tickets (staff only)
 *     responses:
 *       '200':
 *         description: Tickets information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/get_all_tickets", getAllTicketsStaff)

/**
 * @openapi
 * /get_ticket_staff/{id}:
 *   get:
 *     tags:
 *       - Ticket
 *     summary: Get specific info about the ticket (staff only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Ticket ID
 *         schema:
 *           type: string
 *           example: ""
 *     responses:
 *       '200':
 *         description: Tickets information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/get_ticket_staff/:id", getSpecificTicketStaff)

/**
 * @openapi
 * /get-ticket-client/{id}:
 *   get:
 *     tags:
 *       - Ticket
 *     summary: Get specific info about the ticket (client)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB Ticket ID
 *         schema:
 *           type: string
 *           example: ""
 *     responses:
 *       '200':
 *         description: Tickets information retrieved
 *       '403':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/get-ticket-client/:id", getSpecificTicketClient)

export default router
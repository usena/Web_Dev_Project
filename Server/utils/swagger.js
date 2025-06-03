import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *      Ticket:
 *         type: object
 *         required:
 *            - ticketTitle
 *            - ticketCategory
 *            - ticketDescription
 *         properties:
 *            _id:
 *               type: object
 *               properties:
 *                  $oid:
 *                     type: string
 *                     description: Unique identifier for the ticket
 *            ticketTitle:
 *               type: string
 *               description: Name of the ticket
 *            ticketCategory:
 *               type: string
 *               description: Category of the ticket
 *            ticketDesc:
 *               type: string
 *               description: description of the ticket
 *            ticketStatus:
 *               type: string
 *               description: state the status of the ticket either "new", "active" or "finished"
 *            createdAt:
 *               type: string
 *               format: date-time
 *               description: Date when the ticket was created
 *            ticketDeadline:
 *               type: Date
 *               format: date-time
 *               description: Date when the ticket is due
 *            ticketResponse:
 *               type: string
 *               description: solution or response to the ticket
 *            updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last date when the ticket's information was updated
 *         example:
 *            _id:
 *               $oid: "uniqueKeyUser"
 *            ticketTitle: "Wrong Booking"
 *            ticketCategory: "booking"
 *            ticketDesc: "I got the date of the flight confused. want to rebook"
*/

const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo List Management API",
            version: "1.0.0",
            description: "API for managing todo list, including user authentication and todo list management.",
        },
        servers: [
            {
                url: "https://helpdesk-t21h.onrender.com/service/ticket",
                description: 'Development - ticket'
            }
        ],
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        path.join(__dirname, '..', 'routes', '*.js'),
        path.join(__dirname, '..', 'routes', '*.ts'),
        path.join(__dirname, 'swagger.js'),
        path.join(__dirname, 'swagger.ts'),
    ],
});

export default swaggerSpec;
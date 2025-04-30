const express = require("express");
const app = express();
const cors = require("cors");
const { tickets, ongoingTickets, completedTickets } = require("./firebase");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the project',
        },
    },
    apis: ['./server.js']
}

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get all tickets
 *     responses:
 *       200:
 *         description: A list of all tickets
 */
app.get("/api", async (req, res) => {
    try {
        const snapshot = await tickets.get();
        const allTickets = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
        res.json(allTickets);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tickets");
    }
});

/**
 * @swagger
 * /api/ongoing:
 *   get:
 *     summary: Get all ongoing tickets
 *     responses:
 *       200:
 *         description: A list of ongoing tickets
 */
app.get("/api/ongoing", async (req, res) => {
    try {
        const snapshot = await ongoingTickets.get();
        const allTickets = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
        res.json(allTickets);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tickets");
    }
});

/**
 * @swagger
 * /api/completed:
 *   get:
 *     summary: Get all completed tickets
 *     responses:
 *       200:
 *         description: A list of completed tickets
 */
app.get("/api/completed", async (req, res) => {
    try {
        const snapshot = await completedTickets.get();
        const allTickets = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
        res.json(allTickets);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tickets");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server stared on port 3000");
})
const express = require("express");
const app = express();
const cors = require("cors");
const { tickets, ongoingTickets, completedTickets } = require("./firebase")

const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));

app.get("/api", async (req, res) => {
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

app.listen(3000, () => {
    console.log("Server stared on port 3000");
})
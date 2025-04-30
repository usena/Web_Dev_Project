const firebase = require("firebase-admin");

const serviceAccount = require("./firebase-key.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();
const tickets = db.collection("tasks");

const ongoingTickets = db.collection("tasks").where("Completed", "==", false);

const completedTickets = db.collection("tasks").where("Completed", "==", true);

module.exports = {
    tickets,
    ongoingTickets,
    completedTickets
}
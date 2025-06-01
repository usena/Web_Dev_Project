import TicketModel from "../models/ticketModel.js";

export const createTicket = async (req, res) => {
    try {
        const { ticketTitle, ticketCategory, ticketDesc} = req.body
        if (!ticketTitle || !ticketCategory || !ticketDesc) {
            return res.status(400).json({message: "Please fill the required fields!"})
        }

        const newTicket = await TicketModel.create({
            ticketTitle,
            ticketCategory,
            ticketDesc
        });
        res.status(200).json({message: "Create a ticket successfully!", newTicket})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const draftResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { ticketCategory, ticketDeadline, ticketResponse } = req.body;

        const updateData = {};

        if (ticketCategory !== undefined) {
            updateData.ticketCategory = ticketCategory;
        }

        if (ticketDeadline !== undefined) {
            updateData.ticketDeadline = ticketDeadline;
        }

        if (ticketResponse !== undefined) {
            updateData.ticketResponse = ticketResponse;
            updateData.ticketStatus = ticketResponse.trim() === "" ? "new" : "active";
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        const updateTicket = await TicketModel.findByIdAndUpdate(id, updateData, {new: true});

        if (!updateTicket) {
            return res.status(404).json({message: "Ticket not found."});
        }

        res.status(200).json({message: "Successfully updated information about the ticket!"})
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

export const submitResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { ticketCategory, ticketDeadline, ticketResponse } = req.body;

        const updateData = {};

        if (ticketCategory !== undefined) {
            updateData.ticketCategory = ticketCategory;
        }

        if (ticketDeadline !== undefined) {
            updateData.ticketDeadline = ticketDeadline;
        }

        if (ticketResponse !== undefined) {
            if (ticketResponse.trim() === "") {
                return res.status(400).json({message: "Response cannot be empty."});
            }
            updateData.ticketResponse = ticketResponse;
            updateData.ticketStatus = "finished";
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        const updateTicket = await TicketModel.findByIdAndUpdate(id, updateData, {new: true});

        if (!updateTicket) {
            return res.status(404).json({message: "Ticket not found."});
        }

        res.status(200).json({message: "Successfully updated information about the ticket!"})
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketModel.find();
        res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
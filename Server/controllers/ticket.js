import TicketModel from "../models/ticketModel.js";
import mongoose from 'mongoose';

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

export const draftResponseStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { ticketCategory, ticketDeadline, ticketResponse } = req.body;

        const updateData = {};

        const isValidField = (val) => {
            if (val === undefined) return false;
            if (typeof val === 'string') return val.trim() !== "";
            return true;
        };

        if (isValidField(ticketCategory)) {
            updateData.ticketCategory = ticketCategory;
        }

        if (isValidField(ticketDeadline)) {
            updateData.ticketDeadline = ticketDeadline;
        }

        if (isValidField(ticketResponse)) {
            updateData.ticketResponse = ticketResponse;
            updateData.ticketStatus = ticketResponse.trim() === "" ? "new" : "active";
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        const draftedTicket = await TicketModel.findByIdAndUpdate(id, updateData, {new: true});

        if (!draftedTicket) {
            return res.status(404).json({message: "Ticket not found."});
        }

        res.status(200).json({
            message: "Successfully updated information about the ticket!",
            status: draftedTicket.ticketStatus
        })
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

export const submitResponseStaff = async (req, res) => {
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
            updateData.ticketDone = new Date();
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update." });
        }

        const submittedResponse = await TicketModel.findByIdAndUpdate(id, updateData, {new: true});

        if (!submittedResponse) {
            return res.status(404).json({message: "Ticket not found."});
        }

        res.status(200).json({message: "Successfully updated information about the ticket!"})
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

export const getAllTicketsStaff = async (req, res) => {
    try {
        const {filter, category} = req.query;
        let query = {};

        if (filter === 'finished') {
            query.ticketStatus = 'finished';
        } else {
            query.ticketStatus = {$ne: 'finished'}
        }

        if (category && category !== 'all') {
            query.ticketCategory = category;
        }

        const tickets = await TicketModel.find(query);
        res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getSpecificTicketStaff = async (req, res) => {
    try {
        const ticketID = req.params.id
        const ticket = await TicketModel.findById(ticketID);
        
        if (!ticket) {
            return res.status(404).json({message: "Ticket not found."});
        }

        const responseData = {
            message: "Successfully retrieved ticket information!",
            ticketData: {
                title: ticket.ticketTitle,
                category: ticket.ticketCategory,
                createdAt: ticket.createdAt,
                replyDate: ticket.ticketDone,
                description: ticket.ticketDesc,
                response: ticket.ticketResponse,
            }
        };

        res.status(200).json(responseData);
    } catch (error){
        return res.status(500).json({ message: error.message});
    }
}

export const getSpecificTicketClient = async (req, res) => {
    try {
        const ticketID = req.params.id
        const ticket = await TicketModel.findById(ticketID);

        if (!ticket) {
            return res.status(404).json({message: "Ticket not found."});
        }

        // Prepare base response data
        const responseData = {
            message: "Successfully retrieved ticket information!",
            ticketData: {
                title: ticket.ticketTitle,
                category: ticket.ticketCategory,
                description: ticket.ticketDesc,
                createdAt: ticket.createdAt
            }
        };

        // Only include response if status is "finished"
        if (ticket.ticketStatus === "finished") {
            responseData.ticketData.response = {
                reply: ticket.ticketResponse,
                replyDate: ticket.ticketDone
            }
        }

        res.status(200).json(responseData);
    } catch (error){
        return res.status(500).json({ message: error.message});
    }
}
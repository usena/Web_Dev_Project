import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
    ticketTitle: {
        type: String,
        required: true,
        index: true,
    },
    ticketCategory: {
        type: String,
        required: true,
        default: "technical",
        enum: ["technical", "complain", "inquiries", "booking", "other"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketDesc: {
        type: String,
        maxLength: 500,
        default: ""
    },
    ticketStatus: {
        type: String,
        required: true,
        default: "new",
        enum: ["new", "active", "finished"]
    },
    ticketDeadline: {
        type: Date,
        required: false,
        default: function() {
            return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        }
    },
    ticketResponse: {
        type: String,
        maxLength: 1000,
        default: ""
    }
}, {
    timestamps: true
})

export default mongoose.model('Ticket', ticketSchema)
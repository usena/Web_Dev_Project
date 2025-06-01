import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        default: "customer",
        enum: ["staff", "customer"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema)
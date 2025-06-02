import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define schema and model inline for simplicity
const feedbackSchema = new mongoose.Schema({
  name: String,
  age: Number,
  feedback: String,
  timestamp: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// POST route to receive form data
router.post('/', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

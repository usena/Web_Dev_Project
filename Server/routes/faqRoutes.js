import express from 'express';
import FAQ from '../models/Faq.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const faqs = await FAQ.find();
  res.json(faqs);
});

router.post('/', async (req, res) => {
  const newFAQ = new FAQ(req.body);
  await newFAQ.save();
  res.status(201).json(newFAQ);
});

router.put('/:id', async (req, res) => {
  const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedFAQ);
});

router.delete('/:id', async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;

import express from 'express';
import User from '../models/users.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  const saved = await newUser.save();
  res.json(saved);
});

export default router;

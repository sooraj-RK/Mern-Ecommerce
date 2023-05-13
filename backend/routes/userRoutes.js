import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const router = express.Router();

import User from '../models/userModel.js';

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save new user to database
    const savedUser = await newUser.save();
    res.json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate and send JWT token
    const token = generateAuthToken(user._id, process.env.JWT_SECRET);
    res.header('auth-token', token).json({ message: 'Logged in successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate JWT token
function generateAuthToken(userId, secretKey) {
  const data = { userId };
  const salt = 'saltySalt'; // you can replace this with a random string of your choice
  const token = jwt.sign({ data }, secretKey, { expiresIn: '1h', issuer: 'myapp.com', subject: 'auth' }, salt);
  return token;
}

export default router;

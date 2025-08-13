// server.js
// ====================================================
// REST API using Express + Mongoose with environment
// variables. Endpoints: GET all, POST create, PUT edit,
// DELETE remove. All handlers use async/await.
// ====================================================

require('dotenv').config({ path: './config/.env' }); // Load env vars early

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB (local or Atlas based on MONGO_URI)
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are standard best-practice flags
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
})();

// -------------------------------------------
// Routes
// -------------------------------------------

// GET: RETURN ALL USERS
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Find all users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error getting users', error: err.message });
  }
});

// POST: ADD A NEW USER TO THE DATABASE
app.post('/api/users', async (req, res) => {
  try {
    // Expecting { name, email, age?, favoriteFoods? } in body
    const user = await User.create(req.body); // Create and save
    res.status(201).json(user); // 201 Created
  } catch (err) {
    // Duplicate email or validation errors show up here
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// PUT: EDIT A USER BY ID
app.put('/api/users/:id', async (req, res) => {
  try {
    // new:true returns the updated doc
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // Enforce schema validation on updates
    });

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

// DELETE: REMOVE A USER BY ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const removed = await User.findByIdAndDelete(req.params.id);

    if (!removed) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted', user: removed });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting user', error: err.message });
  }
});

// Root helper
app.get('/', (req, res) => {
  res.send('Mongoose REST API is running. Use /api/users');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://127.0.0.1:${PORT}`);
});

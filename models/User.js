// models/User.js
// -----------------------------
// Mongoose User model definition
// Includes simple validation rules
// -----------------------------

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Name is required
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    // Email should be unique and valid-looking
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    // Optional fields
    age: {
      type: Number,
      min: 0,
      max: 120
    },
    favoriteFoods: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Export the model to use in server.js
module.exports = mongoose.model('User', userSchema);

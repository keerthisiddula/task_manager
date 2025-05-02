const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model('User', userSchema);

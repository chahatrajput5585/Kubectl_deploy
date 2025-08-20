const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    match: /^\+?\d{7,15}$/,
    required: false,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  recommend: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  suggestion: {
    type: String,
    maxlength: 300,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;

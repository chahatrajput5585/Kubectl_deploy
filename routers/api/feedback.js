const express = require("express");
const {
  addNewFeedback,
  getUserFeedbacks,
} = require("../../controllers/feedback");
const { protect } = require("../../controllers/auth");

const feedbackRoutes = express.Router();

feedbackRoutes.get("/", protect, getUserFeedbacks);
feedbackRoutes.post("/", protect, addNewFeedback);

module.exports = feedbackRoutes;

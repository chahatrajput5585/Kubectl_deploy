const Feedback = require("../model/feedback");

// Feedback middleware: Add new feedback
const addNewFeedback = async (req, res, next) => {
  try {
    const { name, email, phone, visitDate, recommend, rating, suggestion } =
      req.body;

    if (!name || !email || !visitDate || !recommend || !rating) {
      return res.status(400).json({
        message:
          "Name, email, visit date, recommendation, and rating are required",
      });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      name,
      email,
      phone,
      visitDate,
      recommend,
      rating,
      suggestion,
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      "user",
      "name email"
    );

    res.status(201).json({
      data: populatedFeedback,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    next(error);
  }
};

const getUserFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    next(error);
  }
};

module.exports = {
  addNewFeedback,
  getUserFeedbacks,
};

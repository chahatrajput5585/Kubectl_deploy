const express = require("express");

const feedbackRoutes = require("./feedback");

const userController = require("../../controllers/user");

const userRoutes = express.Router();

userRoutes.use("/feedbacks", feedbackRoutes);

userRoutes.post("/signin", userController.signinHandler);
userRoutes.post("/signup", userController.signupHandler);
userRoutes.get("/signout", userController.signoutHandler);


module.exports = userRoutes;

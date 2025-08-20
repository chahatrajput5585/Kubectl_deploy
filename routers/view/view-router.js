const express = require("express");
const { protect, checkForUser } = require("../../controllers/auth");

const viewRouters = express.Router();

viewRouters.get("/signup", (req, res) => {
  res.status(200).render("signup.ejs", { error: false });
});

viewRouters.get("/signin", (req, res) => {
  res.status(200).render("signin.ejs", { error: false });
});

// All below routes are protected

viewRouters.get("/", checkForUser, (req, res) => {
  console.log("User:", req?.user);
  res.status(200).render("index.ejs", { name: req?.user?.name || "" }); //the res.render() function is used to render a view/template file and send the resulting HTML to the browser (client).
});

viewRouters.get("/menu", protect, (req, res) => {
  res.status(200).render("menu.ejs", { name: req?.user?.name || "" });
});

viewRouters.get("/feedback", protect, (req, res) => {
  res.status(200).render("feedback.ejs", { name: req?.user?.name || "" });
});

module.exports = viewRouters;

const express = require("express");
const { protect, checkForUser } = require("../../controllers/auth");
const { requireAdmin } = require("../../controllers/admin");

const viewRouters = express.Router();

viewRouters.get("/signup", (req, res) => {
  res.status(200).render("signup.ejs", { error: false });
});

viewRouters.get("/signin", (req, res) => {
  res.status(200).render("signin.ejs", { error: false, isAdmin: false });
});

viewRouters.get("/admin-login", (req, res) => {
  res.status(200).render("signin.ejs", { error: false, isAdmin: true });
});

// All below routes are protected

viewRouters.get("/", checkForUser, (req, res) => {
  console.log("User:", req?.user);
  res.status(200).render("index.ejs", { name: req?.user?.name || "", user: req?.user }); //the res.render() function is used to render a view/template file and send the resulting HTML to the browser (client).
});

viewRouters.get("/menu", protect, (req, res) => {
  res.status(200).render("menu.ejs", { name: req?.user?.name || "", user: req.user });
});

viewRouters.get("/feedback", protect, (req, res) => {
  res.status(200).render("feedback.ejs", { name: req?.user?.name || "", user: req.user });
});

// Admin routes
viewRouters.get("/admin", protect, requireAdmin, (req, res) => {
  res.status(200).render("admin-dashboard.ejs", { name: req?.user?.name || "", user: req.user });
});

viewRouters.get("/admin/menu", protect, requireAdmin, (req, res) => {
  res.status(200).render("admin-menu.ejs", { name: req?.user?.name || "", user: req.user });
});

viewRouters.get("/admin/menu/new", protect, requireAdmin, (req, res) => {
  res.status(200).render("admin-menu.ejs", { name: req?.user?.name || "", user: req.user, openModal: true });
});

viewRouters.get("/admin/orders", protect, requireAdmin, (req, res) => {
  res.status(200).render("admin-orders.ejs", { name: req?.user?.name || "", user: req.user });
});

// User order history
viewRouters.get("/my-orders", protect, (req, res) => {
  res.status(200).render("my-orders.ejs", { name: req?.user?.name || "", user: req.user });
});

module.exports = viewRouters;

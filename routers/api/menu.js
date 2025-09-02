const express = require("express");
const { protect } = require("../../controllers/auth");
const { requireAdmin } = require("../../controllers/admin");
const menuController = require("../../controllers/menu");

const menuRoutes = express.Router();

// Public routes
menuRoutes.get("/", menuController.getAllMenuItems);
menuRoutes.get("/:id", menuController.getMenuItemById);

// Admin routes
menuRoutes.post("/", protect, requireAdmin, menuController.createMenuItem);
menuRoutes.put("/:id", protect, requireAdmin, menuController.updateMenuItem);
menuRoutes.delete("/:id", protect, requireAdmin, menuController.deleteMenuItem);

module.exports = menuRoutes;

const express = require("express");
const { protect } = require("../../controllers/auth");
const { requireAdmin } = require("../../controllers/admin");
const orderController = require("../../controllers/order");

const orderRoutes = express.Router();

// User routes
orderRoutes.post("/", protect, orderController.createOrder);
orderRoutes.get("/my-orders", protect, orderController.getUserOrders);

// Admin routes
orderRoutes.get("/", protect, requireAdmin, orderController.getAllOrders);
orderRoutes.get("/:id", protect, requireAdmin, orderController.getOrderById);
orderRoutes.put("/:id/status", protect, requireAdmin, orderController.updateOrderStatus);

module.exports = orderRoutes;

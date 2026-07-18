const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/all", authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus)

module.exports = router;
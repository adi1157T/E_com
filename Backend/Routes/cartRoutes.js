const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/add",authMiddleware, addToCart);
router.get("/",authMiddleware, getCart);
router.delete("/:productId",authMiddleware, removeFromCart);

module.exports = router;
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const authenticateToken = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

//* Create a order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;
    const qty = req.body.qty ?? 1;

    if (!productId) {
      return res.status(500).json({ message: "Product ID required" });
    } else {
      const product = await Product.findById(productId);

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2);

      const order = new Order({
        productId: productId,
        userId: userId,
        qty: qty,
        total: product.price * qty,
        purchaseDate: new Date(),
        location: req.body.location,
        deliveryDate: deliveryDate,
        status: "in-progress",
      });

      await order.save();
      res.status(201).json(order);
    }
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//order status Change
router.put(
  "/:id",
  [
    authenticateToken,
    [
      body("status")
        .notEmpty()
        .withMessage("status is required")
        .isIn(["in-progress", "delivered", "shipped", "cancelled"])
        .withMessage("Status invalid"),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (req.user.role != "admin") {
        return res.status(400).json({ message: "You are not an admin" });
      } else {
        const id = req.params.id;
        const status = req.body.status;
        const order = await Order.findByIdAndUpdate(
          id,
          { status: status },
          { new: true },
        );
        if (order) {
          res.status(200).json(order);
        } else {
          res.status(400).json({ message: "Product Not Found." });
        }
      }
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);


// Get all orders by user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId: userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


// Get one order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const order = await Order.findOne({ _id: id, userId: userId });
    if (order) {
      res.json(order);
    } else {
      return res.status(400).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Delete One Order
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const order = await Order.findOneAndDelete({ _id: id, userId: userId });
    if (order) {
      res.json({message:"Delete Order Successfully" });
    } else {
      return res.status(400).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}); 

module.exports = router;

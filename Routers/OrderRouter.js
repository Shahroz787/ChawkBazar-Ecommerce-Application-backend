import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import Order from "../Models/OrderModal.js";

const orderRouter = express.Router();

// Get all orders (admin use)
orderRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  })
);

// Place a new order
orderRouter.post('/', isAuth, async (req, res) => {
  try {
    console.log("✅ Request Body:", req.body);

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).send({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();
    console.log("✅ Order created:", createdOrder);

    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  } catch (error) {
    console.error("❌ Error in /api/orders:", error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found!" });
    }
  })
);

export default orderRouter;

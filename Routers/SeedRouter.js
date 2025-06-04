import express from "express";
import data from "../data.js";
import Product from "../Models/productModal.js";
import User from "../Models/UserModal.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  await Product.insertMany(data.products);

  await User.deleteMany({});
  await User.insertMany(data.users);

  res.send({ message: "Seeded successfully" });
});

export default seedRouter;

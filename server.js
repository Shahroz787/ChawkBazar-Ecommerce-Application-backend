import express from "express";
import path from "path";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from "./Routers/SeedRouter.js";
import productRouter from "./Routers/ProductRouter.js";
import userRouter from "./Routers/UserRouter.js";
import orderRouter from "./Routers/OrderRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);


if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  })
}

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`Your server is running at ${port}`);
});

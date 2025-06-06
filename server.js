import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from "./Routers/SeedRouter.js";
import productRouter from "./Routers/ProductRouter.js";
import userRouter from "./Routers/UserRouter.js";
import orderRouter from "./Routers/OrderRouter.js";

dotenv.config();

const app = express();

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

// ✅ Add this basic route
app.get('/', (req, res) => {
  res.send("API is working!");
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// ✅ Export the app
export default app;

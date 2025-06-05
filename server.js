import express from "express";
import path from "path";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from "./Routers/SeedRouter.js";
import productRouter from "./Routers/ProductRouter.js";
import userRouter from "./Routers/UserRouter.js";
import orderRouter from "./Routers/OrderRouter.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
// const port = process.env.PORT || 5001;

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Don’t listen, just export
export default app;


// app.listen(port, () => {
//   console.log(`Your server is running at ${port}`);
// });

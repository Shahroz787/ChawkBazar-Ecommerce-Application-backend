import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { isAuth, generateToken } from "../utils.js";
import User from "../Models/UserModal.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Your email or password is incorrect!" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    try {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });

      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } catch (error) {
      console.error("Signup error:", error); // <--- Add this line
      res.status(500).send({ message: "Error creating user", error: error.message });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updateUser = await user.save();
      res.send({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser),
      });
    } else {
      res.status(404).send({ message: "User not found!" });
    }
  })
);
export default userRouter;

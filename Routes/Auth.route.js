import express from "express";
import createHttpError from "http-errors";
import User from "../models/User.model.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createHttpError.BadRequest();
    const doesUserExist = await User.findOne({ email });
    if (doesUserExist)
      throw createHttpError.Conflict(`${email} is already been registered`);
    const user = new User({ email, password });
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  res.send("Login route");
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

router.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});

export default router;

import express from "express";
import createHttpError from "http-errors";
import User from "../models/User.model.js";
import { authSchema } from "../helpers/validation_schema.js";
import { signAccessToken } from "../helpers/jwt_helper.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    // const { email, password } = req.body;
    // if (!email || !password) throw createHttpError.BadRequest();
    const result = await authSchema.validateAsync(req.body);

    const doesUserExist = await User.findOne({ email: result.email });
    if (doesUserExist)
      throw createHttpError.Conflict(
        `${result.email} is already been registered`
      );

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);

    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });

    if (!user) throw createHttpError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);

    if (!isMatch)
      throw createHttpError.Unauthorized("Invalid Username/Password");

    const accessToken = await signAccessToken(user.id);

    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createHttpError.BadRequest("Invalid Username/Password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

router.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});

export default router;

import express from "express";
import createHttpError from "http-errors";
import User from "../models/User.model.js";
import { authSchema } from "../helpers/validation_schema.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helper.js";
import client from "../helpers/init_redis.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const result = await authSchema.validateAsync(req.body);

    const doesUserExist = await User.findOne({ email: result.email });
    if (doesUserExist)
      throw createHttpError.Conflict(
        `${result.email} is already been registered`
      );

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    res.send({ accessToken, refreshToken });
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
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true)
      return next(createHttpError.BadRequest("Invalid Username/Password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = await verifyRefreshToken(refreshToken);
    client.DEL(userId, (err, val) => {
      if (err) {
        console.log(err.message);
        throw createHttpError.InternalServerError();
      }
      console.log(val);
      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
});

export default router;

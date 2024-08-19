import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();
const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "15s",
      issuer: "authmern.com",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "authmern.com",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = async (req, res, next) => {
  try {
    if (!req.headers["authorization"])
      return next(createHttpError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;

        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  } catch (error) {}
};

export { signAccessToken, signRefreshToken, verifyAccessToken };

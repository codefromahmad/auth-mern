import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();
const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
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

export { signAccessToken };

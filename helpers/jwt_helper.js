import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import e from "express";

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = "some super secret";
    const options = {
      expiresIn: "1h",
      issuer: "authmern.com",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

export { signAccessToken };

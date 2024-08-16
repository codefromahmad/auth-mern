import express from "express";
import createHttpError from "http-errors";
import dotenv from "dotenv";
import AuthRoute from "./Routes/Auth.route.js";

// const AuthRoute = require("./Routes/Auth.route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/auth", AuthRoute);

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

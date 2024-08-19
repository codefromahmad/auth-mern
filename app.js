import express from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import AuthRoute from "./Routes/Auth.route.js";
import "./helpers/init_mongodb.js";
import { verifyAccessToken } from "./helpers/jwt_helper.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use("/auth", AuthRoute);

app.get("/", verifyAccessToken, (req, res, next) => {
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

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.accessToken": token, // Ensure this matches your user schema
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found or token invalid" });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log the error for debugging
    res
      .status(401)
      .json({ message: "Authentication failed.", error: error.message });
  }
};

import express from "express";
import {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
  updatePassword,
} from "../controllers/ResetPinController.js";
import { Auth } from "../utils/jwtFunction.js";

const resetRouter = express();
resetRouter.post("/send-otp", sendResetOTP);
resetRouter.post("/verify-otp", verifyResetOTP);
resetRouter.post("/reset-password", resetPassword);
resetRouter.put("/update-password", Auth, updatePassword);

export default resetRouter;

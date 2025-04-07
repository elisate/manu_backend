import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendMailer.js";

// Send OTP to Email
export const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();

    const subject = "Your Password Reset OTP";
    const message = `Hi ${user.firstname},\n\nYour OTP is: ${otp}.\nIt will expire in a few minutes.\n\nIf you didn't request this, please ignore this message.`;

    await sendEmail(user.email, subject, message);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};


// Reset Password

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null; // Clear OTP
    await user.save();

    // Send confirmation email
    const subject = "Password Reset Successful";
    const message = `Hello ${user.firstname},\n\nYour password has been successfully reset.\nIf this wasn't you, please contact our support immediately.\n\nBest regards,\nManu ltd Support Team`;

    await sendEmail(user.email, subject, message);

    res
      .status(200)
      .json({ message: "Password reset successfully and email sent" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
};

// Verify OTP
export const verifyResetOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      res.status(200).json({ message: "OTP verified" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error verifying OTP", error: err.message });
    }
  };
  
// Update Password when logged in
export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.user; // assuming middleware has attached user to req
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating password", error: err.message });
  }
};

import express from "express";
import Donation from "../models/DonationModel.js";
import sendEmail from "../utils/sendMailer.js";
import User from "../models/userModel.js";



// Create a Donation (User may or may not be logged in)
export const createDonation = async (req, res) => {
  try {
    const { AmountDonated, Comment, PhoneNum, donorEmail, ProjectId } = req.body;

    // Validate required fields
    if (!AmountDonated || !Comment || !PhoneNum || !ProjectId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (isNaN(AmountDonated) || AmountDonated <= 0) {
      return res.status(400).json({ message: "AmountDonated must be a valid number greater than 0" });
    }

    // Extract logged-in user ID if available
    const userId = req.user ? req.user.id : null;  // Allow anonymous donations

    // Create donation
    const newDonation = new Donation({
      AmountDonated,
      Comment,
      PhoneNum,
      donorEmail,
      userId,
      ProjectId,
      status: "Pending",
    });

    const savedDonation = await newDonation.save();

    // Send email to donor (if email is provided)
    if (donorEmail) {
      const subject = "Thank You for Your Donation!";
      const htmlContent = `
        <h2>Dear Donor,</h2>
        <p>Thank you for your generous donation of <strong>$${AmountDonated}</strong> to our project.</p>
        <p><strong>Comment:</strong> ${Comment}</p>
        <p>Your support means a lot to us!</p>
        <br>
        <p>Best regards,</p>
        <p>The Project Team</p>
      `;

      const emailSent = await sendEmail(donorEmail, subject, htmlContent);
      if (!emailSent) {
        console.log("Failed to send donor email.");
      }
    }

    res.status(201).json({ message: "Donation created successfully", donation: savedDonation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
export default createDonation;
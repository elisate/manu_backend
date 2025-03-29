import express from "express";
import Donation from "../models/DonationModel.js";
import sendEmail from "../utils/sendMailer.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";


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

export const ProjectById= async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const donations = await Donation.find({ ProjectId: projectId }).populate("userId", "email");
    
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
};




export const getDonationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate if the userId is a valid MongoDB ObjectId format (24-character hex string)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Convert the string userId to ObjectId
    const donations = await Donation.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("ProjectId", "projectName"); // Adjust based on your project schema

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user donations", error: error.message });
  }
};



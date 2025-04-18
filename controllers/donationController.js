import express from "express";
import Donation from "../models/DonationModel.js";
import sendEmail from "../utils/sendMailer.js";

import mongoose from "mongoose";
// Create a Donation (User may or may not be logged in)
export const createDonation = async (req, res) => {
  try {
    const { AmountDonated, Comment, PhoneNum, donorEmail, ProjectId,DonorName} = req.body;

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
      DonorName,
      status: "Pending",
    });

    const savedDonation = await newDonation.save();

    // Send email to donor (if email is provided)
    if (donorEmail) {
      const subject = "Thank You for Your Donation!";
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #234198;">Dear ${DonorName},</h2>
        <p>Thank you for your generous donation of 
          <strong style="color: #234198;">${AmountDonated}Rwf</strong> to our project.</p>
    
        <p><strong >Your donation is currently pending</strong> 
        and will be confirmed after  paying ${AmountDonated} to the number below:</p>
    
        <p><strong>Phone number: 0780416453</strong></p>
    
        <p>Your support means a lot to us and is helping make a difference!</p>
    
        <br>
        <p>Best regards,</p>
        <p style="color: #234198;"><strong>Manu Ltd Team</strong></p>
      </div>
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

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("userId", "firstname lastname email") // Populate donor's name and email
      .populate("ProjectId", "title") // Populate project name
      .select("AmountDonated Comment PhoneNum donorEmail status donorItem"); // Include donor item field

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error: error.message });
  }
};


// Update Donation approval status by admin
export const UpdateDonationApprovalStatus = async (req, res) => {
  const { donationId, approvalStatus } = req.body;

  // console.log('Incoming request:', req.body);

  try {
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { status: approvalStatus }, // ✅ Correct field name
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log('Updated project:', donation);

    res.status(200).json({
      message: "Project approval status updated successfully",
      donation,
    });
  } catch (error) {
    console.error('Error updating project approval status:', error);
    res.status(500).json({ message: "Error updating approval status" });
  }
};

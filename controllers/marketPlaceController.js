import Market from "../models/marketPlace.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createMarket = async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.images[0].path);
    // Retrieve data from the request body
    const {
      itemName,
      itemPrice,
      itemDeliveryStatus,
      companyOwner,
      description,
      posterName,
      location,
      contact,
      itemCondition,
    } = req.body;
    const images = result.secure_url; // Get the secure image URL from Cloudinary

    // Create a new blog post object
    const newMarketPost = await Market.create({
      itemName,
      itemPrice,
      itemDeliveryStatus,
      companyOwner,
      images,
      description,
      posterName,
      location,
      contact,
      itemCondition,
    });

    res.status(200).json(newMarketPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all projects
export const getAllMarkets = async (req, res) => {
  try {
    const markets = await Market.find();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
export const getMarketById = async (req, res) => {
  try {
    const markets = await Market.findById(req.params.id);
    if (!markets) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update a project
// Update a market item
export const updateMarkets = async (req, res) => {
  try {
    // Check if the item exists
    const project = await Market.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Handle image update (if new image is provided)
    let updatedImages = project.images;

    if (req.files?.images && req.files.images.length > 0) {
      const result = await cloudinary.uploader.upload(req.files.images[0].path);
      updatedImages = [result.secure_url]; // Ensure it's an array
    }

    // Update all relevant fields
    project.itemName = req.body.itemName || project.itemName;
    project.itemPrice = req.body.itemPrice || project.itemPrice;
    project.itemDeliveryStatus = req.body.itemDeliveryStatus || project.itemDeliveryStatus;
    project.location = req.body.location || project.location;
    project.companyOwner = req.body.companyOwner || project.companyOwner;
    project.itemCondition = req.body.itemCondition || project.itemCondition;
    project.description = req.body.description || project.description;
    project.posterName = req.body.posterName || project.posterName;
    project.contact = req.body.contact || project.contact;
    project.images = updatedImages;

    // Save and respond with the updated project
    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating market item:", error);
    res.status(500).json({ message: "Failed to update item" });
  }
};

// Delete a project
export const deleteMarket= async (req, res) => {
  try {
    const project = await Market.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

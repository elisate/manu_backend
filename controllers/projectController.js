import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
import { filterApprovedProjects } from "../middlewares/adminApprove.js";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createProject = async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.images[0].path);
    // Retrieve data from the request body
    const {
      title,
      description,
      posterName,
      location,
      contact,
      itemCondition,
      category,
      beneficiary,
      approvalStatus,
    } = req.body;
    const images = result.secure_url; // Get the secure image URL from Cloudinary

    // Create a new blog post object
    const newProjectPost = await Project.create({
      title,
      images,
      description,
      posterName,
      location,
      contact,
      itemCondition,
      category,
      beneficiary,
      approvalStatus,
    });

    res.status(200).json(newProjectPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all projects  // Fetch all projects for admin view
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update a project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    let updatedImage = project.images; // Keep existing image if not changed

    // Upload new image if provided
    if (req.files?.images) {
      const result = await cloudinary.uploader.upload(req.files.images[0].path);
      updatedImage = result.secure_url;
    }

    // Update project fields
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.posterName = req.body.posterName || project.posterName;
    project.location = req.body.location || project.location;
    project.contact = req.body.contact || project.contact;
    project.itemCondition = req.body.itemCondition || project.itemCondition;
    project.category = req.body.category || project.category;
    project.beneficiary = req.body.beneficiary || project.beneficiary;
    project.images = updatedImage;
    project.approvalStatus= req.body.approvalStatus || project.approvalStatus;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//----------------- SPECIAL CONTROLLERS-------------------------------------------------------------------

// Fetch all approved projects for user landing page


export const getAllProjectsUser = async (req, res) => {
  try {
    const projects = req.filteredProjects;
    // Send the data wrapped in an object like { data: projects }
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Update approval status by admin
export const updateApprovalStatus = async (req, res) => {
  const { id, approvalStatus } = req.body; // Make sure you are passing `approvalStatus`

  // Log incoming request body for debugging
  console.log('Incoming request:', req.body);

  try {
    // Find the project by ID and update its approval status
    const project = await Project.findByIdAndUpdate(
      id,
      { approvalStatus: approvalStatus }, // Ensure the correct field is updated
      { new: true } // Return the updated document
    );

    // If the project is not found, return an error
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Log the updated project for debugging
    console.log('Updated project:', project);

    // Respond with the updated project details
    res.status(200).json({
      message: "Project approval status updated successfully",
      project,
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error updating project approval status:', error);
    res.status(500).json({ message: "Error updating approval status" });
  }
};

export const rejectProject = async (req, res) => {
  const { id } = req.body;  // Get the project id from the request body

  try {
    // Find the project by ID and update its approval status to "Rejected"
    const project = await Project.findByIdAndUpdate(
      id,
      { approvalStatus: "Rejected" },  // Set the status to "Rejected"
      { new: true }  // Return the updated project document
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Send back the updated project with status "Rejected"
    res.status(200).json({
      message: "Project rejected successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting project", error });
  }
};
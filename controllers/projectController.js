import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";
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
    const { title, description, posterName, location, contact, itemCondition } =
      req.body;
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
    });

    res.status(200).json(newProjectPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all projects
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
      project.images = updatedImage;
  
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
  
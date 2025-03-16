import { v2 as cloudinary } from "cloudinary";
// import configureMulter from "../config/multerConfig.js";
import configureMulter from "../../utils/multer.js";
import Project from '../models/projectModal.js'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Create a new project with file upload
export const createProject = async (req, res) => {
  const upload = configureMulter();

  // Upload files to Cloudinary
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    try {
      // Create new project from request body and add uploaded file paths
      const newProject = new Project({
        projectTitle: req.body.projectTitle,
        projectContent: req.body.projectContent,
        projectRep: req.body.projectRep,
        projectLink: req.body.projectLink,
        videos: req.files?.videos?.map((file) => file.path) || [],
        documents: req.files?.documents?.map((file) => file.path) || [],
        images: req.files?.images?.map((file) => file.path) || [],
      });

      const savedProject = await newProject.save(); // Save the project
      res.status(201).json(savedProject); // Respond with saved project
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating project", error: err.message });
    }
  });
};

// Update a project with file upload
export const updateProject = async (req, res) => {
  const upload = configureMulter();

  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    try {
      // Find existing project by ID
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Update project fields and add new file paths if files are uploaded
      project.projectTitle = req.body.projectTitle || project.projectTitle;
      project.projectContent =
        req.body.projectContent || project.projectContent;
      project.projectRep = req.body.projectRep || project.projectRep;
      project.projectLink = req.body.projectLink || project.projectLink;
      if (req.files?.videos) {
        project.videos = req.files.videos.map((file) => file.path);
      }
      if (req.files?.documents) {
        project.documents = req.files.documents.map((file) => file.path);
      }
      if (req.files?.images) {
        project.images = req.files.images.map((file) => file.path);
      }

      const updatedProject = await project.save(); // Save updated project
      res.status(200).json(updatedProject); // Respond with updated project
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating project", error: err.message });
    }
  });
};


// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    // Find all projects in the database
    const projects = await Project.find();

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json(projects); // Respond with the list of projects
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

import Project from "../models/projectModel.js";
export const filterApprovedProjects = async (req, res, next) => {
  try {
    // Fetch the projects with "Approved" status
    const approvedProjects = await Project.find({
      approvalStatus: "Approved",
    });

    // Attach the filtered projects to the request object (optional)
    req.filteredProjects = approvedProjects;

  
    next();
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};
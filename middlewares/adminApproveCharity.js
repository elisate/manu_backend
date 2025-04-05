import Project from "../models/charityModel.js";
export const filterApprovedCharity = async (req, res, next) => {
  try {
    // Fetch the projects with "Approved" status
    const approvedCharity = await Project.find({
      approvalStatus: "Approved",
    });

    // Attach the filtered projects to the request object (optional)
    req.filteredProjects = approvedCharity;

  
    next();
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};
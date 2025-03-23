import Project from "../models/projectModel.js";

export const checkApproval = async (req, res, next) => {
  try {
    // Check if the request is for fetching projects
    if (req.method === "GET" && req.baseUrl.includes("/projects")) {
      const approvedProjects = await Project.find({ approvalStatus: "Approved" });
      req.approvedProjects = approvedProjects;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error filtering approved projects" });
  }
};

import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
updateApprovalStatus,rejectProject,
  getAllProjectsUser,
  getProjectsByUserId 
} from "../controllers/projectController.js";
import configureMulter from "../utils/multer.js";
import {filterApprovedProjects} from "../middlewares/adminApprove.js";

const projectRouter = express();
const upload = configureMulter();
projectRouter.post("/createProject", upload, createProject);
projectRouter.get("/getAllProjects", getAllProjects);
projectRouter.get("/getProjectById/:id", getProjectById);
projectRouter.put("/updateProject/:id", upload,updateProject);
projectRouter.delete("/deleteProject/:id", deleteProject);
// ------special Routes -----------------
projectRouter.get("/ApprovedProjects",filterApprovedProjects,getAllProjectsUser)
projectRouter.put("/updateApprovalStatus",updateApprovalStatus)
projectRouter.put('/rejectProject', rejectProject);
projectRouter.put('/userProjects/:userId', getProjectsByUserId);

export default projectRouter;

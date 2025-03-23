import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getApprovedProjects,updateApprovalStatus
} from "../controllers/projectController.js";
import configureMulter from "../utils/multer.js";
import { checkApproval } from "../middlewares/adminApprove.js";

const projectRouter = express();
const upload = configureMulter();
projectRouter.post("/createProject", upload, createProject);
projectRouter.get("/getAllProjects", getAllProjects);
projectRouter.get("/getProjectById/:id", getProjectById);
projectRouter.put("/updateProject/:id", upload,updateProject);
projectRouter.delete("/deleteProject/:id", deleteProject);
// ------special Routes -----------------
projectRouter.get("/ApprovedProjects",checkApproval,getApprovedProjects)
projectRouter.put("/updateApprovalStatus",updateApprovalStatus)

export default projectRouter;

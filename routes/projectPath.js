import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import configureMulter from "../utils/multer.js";

const projectRouter = express();
const upload = configureMulter();
projectRouter.post("/createProject", upload, createProject);
projectRouter.get("/getAllProjects", getAllProjects);
projectRouter.get("/getProjectById/:id", getProjectById);
projectRouter.put("/updateProject/:id", upload,updateProject);
projectRouter.delete("/deleteProject/:id", deleteProject);

export default projectRouter;

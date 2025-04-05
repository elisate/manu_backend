import express from "express";
import {
  createCharity,
  getAllCharitiesUser,
  getCharitiesByUserId,
  deleteCharity,
  updateApprovalStatus,
  updateCharity,
  getCharityById,
  getAllCharity,
  rejectCharity
} from "../controllers/CharityController.js";
import configureMulter from "../utils/multer.js";
import { filterApprovedCharity } from "../middlewares/adminApproveCharity.js";

const charityRouter = express();
const upload = configureMulter();
charityRouter.post("/createCharity", upload, createCharity);
charityRouter.get("/getAllCharity", getAllCharity);
charityRouter.get("/getCharityById/:id", getCharityById);
charityRouter.put("/updateCharity/:id", upload, updateCharity);
charityRouter.delete("/deleteCharity/:id", deleteCharity);
// ------special Routes -----------------
charityRouter.get(
  "/ApprovedCharity",
  filterApprovedCharity,
  getAllCharitiesUser
);
charityRouter.put("/updateApprovalStatus", updateApprovalStatus);
charityRouter.put("/rejectCharity", rejectCharity);
charityRouter.put("/userCharity/:userId", getCharitiesByUserId);

export default charityRouter;

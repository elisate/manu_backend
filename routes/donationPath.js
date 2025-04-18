import {createDonation,getDonationsByUserId,getAllDonations, UpdateDonationApprovalStatus, getDonationById}from "../controllers/donationController.js";
import { Auth } from "../utils/jwtFunction.js";
import express from "express"

const donateRouter=express();
donateRouter.post("/createDonation",Auth,createDonation)
donateRouter.get("/donations/:userId",getDonationsByUserId);
donateRouter.get("/getAllDonation",getAllDonations);
donateRouter.get("/getDonationById/:donationId",getDonationById)
donateRouter.put("/UpdateDonationApprovalStatus", UpdateDonationApprovalStatus);


export default donateRouter;
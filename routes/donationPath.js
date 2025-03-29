import {createDonation,getDonationsByUserId}from "../controllers/donationController.js";
import { Auth } from "../utils/jwtFunction.js";
import express from "express"

const donateRouter=express();
donateRouter.post("/createDonation",Auth,createDonation)
donateRouter.get("/donations/:userId",getDonationsByUserId);

export default donateRouter;
import { createSubscription,getSubscriptions,deleteSubscription } from "../controllers/subController.js";
import express from "express"

const subRouter=express();
subRouter.post("/createSubscription",createSubscription)
subRouter.get("/getSubscriptions",getSubscriptions)
subRouter.delete("/deleteSubscription/:id",deleteSubscription)
export default subRouter;
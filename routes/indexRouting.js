
import express from "express"
import userRouter from "./userPath.js";
import blogRouter from "./blogRouter.js";
import projectRouter from "./projectPath.js";
import marketRouter from "./marketPlaceRoute.js";
import subRouter from "./subPath.js";
import donateRouter from "./donationPath.js";
import charityRouter from "./charityRouter.js";
const mainRouter=express.Router();
mainRouter.use("/user",userRouter);
mainRouter.use("/blog",blogRouter);
mainRouter.use("/project",projectRouter);
mainRouter.use("/marketItem",marketRouter);
mainRouter.use("/sub",subRouter);
mainRouter.use("/donation",donateRouter)
mainRouter.use("/charity",charityRouter);
export default mainRouter;
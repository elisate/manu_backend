
import express from "express"
import userRouter from "./userPath.js";
import blogRouter from "./blogRouter.js";
import projectRouter from "./projectPath.js";
import marketRouter from "./marketPlaceRoute.js";
const mainRouter=express.Router();
mainRouter.use("/user",userRouter);
mainRouter.use("/blog",blogRouter);
mainRouter.use("/project",projectRouter);
mainRouter.use("/marketItem",marketRouter);

export default mainRouter;
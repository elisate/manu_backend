import express from "express";
import { createBlog } from "../controllers/BlogController.js";
import configureMulter from "../utils/multer.js";
const blogRouter=express();
const upload=configureMulter();
blogRouter.post("/createBlog",upload,createBlog)
export default blogRouter;
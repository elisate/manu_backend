import express from "express";
import { createBlog, getAllBlogs,getBlogById,updateBlog,deleteBlog, } from "../controllers/BlogController.js";
import configureMulter from "../utils/multer.js";
const blogRouter=express();
const upload=configureMulter();
blogRouter.post("/createBlog",upload,createBlog)
blogRouter.get("/getAllBlogs", getAllBlogs);
blogRouter.get("/getBlogById/:id", getBlogById);
blogRouter.put("/updateBlog/:id", upload, updateBlog);
blogRouter.delete("/deleteBlog/:id", deleteBlog);
export default blogRouter;
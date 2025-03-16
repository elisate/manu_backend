import { v2 as cloudinary } from "cloudinary";
// import configureMulter from "../config/multerConfig.js";
import Blog from "../models/blogModel.js";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createBlog=async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.files.images[0].path);
      // Retrieve data from the request body
      const { title, content } = req.body;
      const images = result.secure_url; // Get the secure image URL from Cloudinary
  
      // Create a new blog post object
      const newBlogPost = await Blog.create({
        title,
        content,
        images,
      });
  
      res.status(200).json(newBlogPost);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  
  export const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find();
      if (!blogs.length) {
        return res.status(404).json({ message: "No blogs found" });
      }
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  export const getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateBlog = async (req, res) => {
    try {
      const { title, content } = req.body;
      let updatedData = { title, content };
  
      // Check if there is a new image uploaded
      if (req.files?.images) {
        const result = await cloudinary.uploader.upload(req.files.images[0].path);
        updatedData.images = result.secure_url; // Update image URL
      }
  
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  export const deleteBlog = async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
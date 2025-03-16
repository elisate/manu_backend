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
  
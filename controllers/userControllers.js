import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { generateAccessToken } from "../utils/generateUserTokens.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, gender, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = new User({
      firstname,
      lastname,
      email,
      gender,
      password: hashedPassword,
      role,
    });

    user.tokens.accessToken = generateAccessToken(user);

    await user.save();
    res.status(201).json({
      message: "Account created successfully!",
      user: {
        ...user.toObject(),
        tokens: {
          accessToken: user.tokens.accessToken,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);

    user.tokens = { accessToken };
    await user.save();

    const userResponse = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      tokens: { accessToken },
    };

    res.json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CRUD Operations

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};



export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};


export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    // Check if a file is uploaded
    if (req.file) {
      const imagePath = req.file.path;
      if (!updates.images) updates.images = [];
      updates.images.push(imagePath);
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};


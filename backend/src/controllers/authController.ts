import { type Request, type Response } from "express";
import User from "../models/userModel.js";
import {
  generateTokenForUsers,
  hashPassword,
  verifyPassword,
} from "../services/authServices.js";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
};

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "One or multiple fields are missing" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" }); 
      return;
    }

    const hashedPassword: string = await hashPassword(password);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const newUser = await user.save();

    const token = generateTokenForUsers(newUser._id as string, newUser.role);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ message: "Server error" });
  }
};

type LoginBody = {
  email?: string;
  password?: string;
};

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "One or multiple fields are missing" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" }); 
      return;
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateTokenForUsers(user._id as string, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ message: "Logged out successfully" });
};
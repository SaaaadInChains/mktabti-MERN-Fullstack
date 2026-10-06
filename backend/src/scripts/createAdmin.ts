import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/userModel.ts";
import { hashPassword } from "../services/authServices.ts";
import { connectDB } from "../config/mongoConfig.ts";

const createAdmin = async (): Promise<void> => {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "Missing ADMIN_USERNAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env",
    );
    process.exit(1);
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Admin user already exists.");
      } else {
        existingUser.role = "admin";
        await existingUser.save();
        console.log(
          `User ${existingUser.username} has been promoted to admin.`,
        );
      }
    } else {
      const hashedPassword = await hashPassword(ADMIN_PASSWORD);

      const admin = new User({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });

      await admin.save();
      console.log(`Admin user created: ${admin.username} (${admin.email})`);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();

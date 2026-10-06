import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/userModel.ts";
import { hashPassword } from "../services/authServices.ts";
import { connectDB } from "../config/mongoConfig.ts";

const createWorker = async (): Promise<void> => {
  const { WORKER_USERNAME, WORKER_EMAIL, WORKER_PASSWORD } = process.env;

  if (!WORKER_USERNAME || !WORKER_EMAIL || !WORKER_PASSWORD) {
    console.error(
      "Missing WORKER_USERNAME, WORKER_EMAIL, or WORKER_PASSWORD in .env",
    );
    process.exit(1);
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({
      $or: [{ email: WORKER_EMAIL }, { username: WORKER_USERNAME }],
    });

    if (existingUser) {
      if (existingUser.role === "worker") {
        console.log("Worker user already exists.");
      } else {
        existingUser.role = "worker";
        await existingUser.save();
        console.log(
          `User ${existingUser.username} has been promoted to worker.`,
        );
      }
    } else {
      const hashedPassword = await hashPassword(WORKER_PASSWORD);

      const worker = new User({
        username: WORKER_USERNAME,
        email: WORKER_EMAIL,
        password: hashedPassword,
        role: "worker",
      });

      await worker.save();
      console.log(`Worker user created: ${worker.username} (${worker.email})`);
    }
  } catch (error) {
    console.error("Error creating worker:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

createWorker();

import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.DB_URI;
  if (!uri) throw new Error("DB_URI is not set");

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error Database");
    process.exit(1);
  }
};

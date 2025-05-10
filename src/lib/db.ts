import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    console.error("Full error:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
import { config } from 'dotenv';
import mongoose from 'mongoose';
config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    mongoose.connection.on('connected', () => {
      console.log("connected to MongoDB");
    });
    
    mongoose.connection.on('error', (err) => {
      console.log("error connecting", err);
    });
    
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
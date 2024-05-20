import dotenv from 'dotenv';
import listRoutes from './routes/listRoutes.js';
import express, { json } from "express";
import connectDB from './db/db.js';

dotenv.config();
connectDB()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/lists', listRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

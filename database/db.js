import mongoose from "mongoose";
import { DATABASE_URL } from "../utils/config.js";


export const dbConnect = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error.message);
    }
}
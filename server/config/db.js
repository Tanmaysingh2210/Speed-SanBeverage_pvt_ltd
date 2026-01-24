import mongoose from 'mongoose';
import User from '../models/user.js';

const MONGO_URI = `mongodb://127.0.0.1:27017/speed`;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);

        console.log("Mongodb connected successfully");

        await User.createCollection();

        console.log("User collection created successfully");
    } catch (err) {
        console.log("mongodb connection failed", err.message);
        process.exit(1);
    }
}

export default connectDB;
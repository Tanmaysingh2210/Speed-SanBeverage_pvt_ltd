const mongoose = require('mongoose');
const User = require('../models/user');

const MONGO_URI= `mongodb+srv://wallbookservice_db_user:kqNT5kXUnwHnqYHy@cluster0.jlglxtw.mongodb.net/Speed`;

const connectDB = async ()=>{
    try{
        await mongoose.connect(MONGO_URI);

        console.log("Mongodb connected successfully");

        await User.createCollection();

        console.log("User collection created successfully");
    } catch(err){
        console.log("mongodb connection failed", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
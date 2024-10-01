import mongoose from "mongoose";

let isConnected = false; //variable to track connection status

export const connectToDB = async() =>{
    mongoose.set('strictQuery' , true);

    if(!process.env.MONGODB_URI) return console.log("MONGO DB connection error");

    if(isConnected) return console.log("Using existing DB connection...");

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log("Connected to MongoDB...");
        
    } catch (error) {
        console.log(error);
        
    }
    
    
}
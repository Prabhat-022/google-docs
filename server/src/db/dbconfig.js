import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database is connected ")

    } catch (error) {
        console.log("Database is not connected")

    }
}
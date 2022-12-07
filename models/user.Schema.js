import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({}) both are same now
const userSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Name is required"],
            maxLength: [30, "Name must be less then 30"]
        }
    }
)

module.exports = mongoose.model("user", userSchema)
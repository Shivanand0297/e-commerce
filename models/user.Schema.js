import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";

// const userSchema = new mongoose.Schema({}) both are same now
const userSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Name is required"],
            maxLength: [30, "Name must be less then 30"]
        },
        email: {
            type: String, 
            required: [true, "E-mail is required"],
            unique: true
        },
        password: {
            type: String, 
            required: [true, "Password is required"],
            minLength: [8, "Password must be 8 character long"],
            select: false //whenever we are querying to the database this filed will not come
        },
        role: {
            type: String, 
            // enum: ["ADMIN", "USER"]
            enum: Object.values(AuthRoles),  // this will return the array of AuthRoles values ["ADMIN", "MODERATOR", "USER"]
            default: AuthRoles.USER
        },
        forgotPasswordToken: String, 
        forgotPasswordExpiry: Date
    },
    {
        timeStamps: true
    }
)

export default mongoose.model("user", userSchema)
import User from "../models/user.Schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import cookieOptions from "../utils/cookieOptions"

/**
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signup controller for creating new user
 * @parameters name, email, password
 * @returns User object
 */

export const signup = asyncHandler(async (res, res)=>{
    try {
        // take input from thr frontend
        const {name, email, password} = req.body;
        
        // validate input
        if(!name || !email || !password){
            throw new CustomError("Please fill all the fields", 400)
        }

        // check for already existing user
        const existingUser = await User.findOne({email})
        if(existingUser){
           throw new CustomError("User already exists, please login", 400) 
        }

        // create user
        const user = await User.create({
            name, 
            email, 
            password    //passwor is already encrypted in the usermodel before saving
        })

        // generating token by user method from the userschema
        const token = user.getJwtToken()
        console.log(user); //this will give the whole created user along with the password because this is not the query to the database, at the time of querying to the database password will not come
        // thats why we are setting password to undefined
        user.password = undefined;
        res.cookie("token", token, cookieOptions)
        res.status(200).json({
            success: true, 
            token,
            user
        })

    } catch (error) {
        console.log("error in singup", error.message);
        res.status(400).json({
            success: false,
            message: `error in singup controller ${error.message}`
        })
    }
})
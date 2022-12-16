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
        // note that we dont need trycatch because we handled it in asynchandler
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
        return res.status(200).json({
            success: true, 
            token,
            user
        })
})

/**
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User login controller for logging user
 * @parameters email, password
 * @returns User object
 */

export const login = asyncHandler(async(req, res)=>{
    // taking input from user
    const {name, email} = req.body;

    // validating the input
    if(!name || !email){
        throw new CustomError("Please fill email and password", 400)
    }

    // checkfor existing user
    const user = await User.findOne({email}).select("+password")
    if(!user){
        throw new CustomError("Invalid credentials", 400)
    }

    // matching password
    const isPasswordMatched = await user.comparePassword(password)
    if(isPasswordMatched){
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true, 
            token,
            user
        })
    }
    throw new CustomError("Invalid credentials -pass", 400)
})

export const logout = asyncHandler(async(_req, res)=>{  //_res means we are not using req
    // res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true, 
        message: "logged out"
    })
})
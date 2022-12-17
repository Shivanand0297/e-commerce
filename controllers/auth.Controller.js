import User from "../models/user.Schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import cookieOptions from "../utils/cookieOptions"
import mailHelper from "../utils/mailHelper"
import crypto from "crypto"

/**
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signup controller for creating new user
 * @parameters name, email, password
 * @returns User object
 */

export const signup = asyncHandler(async (req, res)=>{  
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

/**
 * @logout
 * @route 
 * @description logout will clear the cookie to logout
 * @parameters none
 * @returns logout message
 */

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

// now we will work on forgot password

/**
 * @forgotpassword
 * @route http://localhost:5000/api/auth/password/forgot
 * @description user will enter email and generate token
 * @parameters email
 * @returns success message - email sent
 */

export const forgotPassword = asyncHandler(async(req, res)=>{
    // take email from the user
    const {email} = req.body
    if(!email){
        throw new CustomError("please enter email to proceed", 400)
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError("user not found", 404)
    }
    const resetToken = user.generateForgotPasswordToken()
    // we need to save the user because we have made a new entry (forgotPasswordToken, forgotPasswordExpiry) into the user object at the time of the execution of the generateForgotPasswordToken method

    // await user.save() this will look for all the validations we have created inthe database required and all

    await user.save({validateBeforeSave: false})    //to skip all the validation like required and all

    // creating url for resetting password
    const resetURL = 
    `${req.protocol}://${req.get("host")}/api/auth/password/forgot/${resetToken}`

    const text = `Your password reset link is
    \n\n ${resetURL} \n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset for website",
            text: text,
        })
        res.status(200).json({
            success: true, 
            message: `Email sent to ${user.email}`
        })
    } catch (error) {

        // at line no 121 we have already stored forgotpasswordToken and forgotpasswordExpiry in the database do we need to rollback the changes
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        
        // and saving again as before
        await user.save({validateBeforeSave: false})
        throw new CustomError(err.message || "email sent failure", 500)
    }

})

/**
 * @resetpassword
 * @route http://localhost:5000/api/auth/password/reset/:resetToken
 * @description user will be able to reset password based on urltoken
 * @parameters token from url, password and confirmpassword   
 * @returns user object (depends on the flow)
 */

export const resetPassword = asyncHandler(async(req, res)=>{
    // taking resettoken from the params
    const {resetToken} = req.params;

    // taking new password and confirm password from the user
    const {password, confirmPassword} = req.body;

    // since in the database the token is already encrypted so we need to encrypt the above token in order to match it with the database
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // so we need to find the user based on the resetPasswordToken
    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()} //since in the database a future date is set like 3days from now, so this will return user whose expirydate is greater then now()
    })

    if(!user){
        throw new CustomError("password token expired on invalid", 400)
    }
    if(password !== confirmPassword){
        throw new CustomError("password and confirm password doesnot match", 400)
    }

    user.password = password;
    user.forgotPasswordToken = undefined // job is done, no need to store unwanted values in the database
    user.forgotPasswordExpiry = undefined

    await user.save();

    // create token and send as response
    const token = user.getJwtToken()
    user.password = undefined // although not required because we have set it as select: false and are query this time

    // helper method for setting cookies can be added
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        user
    })

})

/**
 * @changepassword
 * @route http://localhost:5000/api/auth/password/change
 * @description user will be able to change password based on old password
 * @parameters old password  
 * @returns user object (depends on the flow)
 */

export const changePassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;

    // getting user based on old password
    const user = await User.findOne({password: oldPassword})
    if(!user){
        throw new CustomError("password does not match", 400)
    }

    // changing password
    user.password = newPassword;

    await user.save({validateBeforeSave: false})
    
    res.status(200).json({
        success: true, 
        message: "Password changed successfully",
        user
    })
})

import User from "../models/user.Schema"
import config from "../config/index"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError";
import jwt from "jsonwebtoken"


export const isLoggedIn = asyncHandler(async(req, _res, next)=>{
    let token;
    if(
        req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) 
    ){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError("Not authorized to use this route", 401)
    }

    try {
        const decodedJwtToken = jwt.verify(token, config.JWT_SECRET)
        
        // this will give us _id, find user based on id and set this in req.user
        req.user = await User.findById(decodedJwtToken._id, "name email role")  //filtering what we want
        next()
    } catch (error) {
        throw new CustomError("Not authorized to use this route" || error.message, 401)
    }
})
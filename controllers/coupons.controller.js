import Coupon from "../models/coupon.Schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"


/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon = asyncHandler(async (req, res)=>{
    // extracting user from the req object from the middleware
    const user = req.user
    if(!user){
        throw new CustomError("Cannot find user", 400)
    }

    if( !(user.role.enum).includes("ADMIN") ||
        !(user.role.enum).includes("MODERATOR")
    ){
        throw new CustomError("Your are not allowed to create a coupon", 400)
    }
    // if the user is admin or moredator the continue..

    const {code, discount} = req.body

    const coupon = await Coupon.create({
        code,
        discount
    })

    if(!coupon){
        throw new CustomError("coupon not created", 400)
    }

    res.status(200).json({
        success: true,
        coupon
    })

})


/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const deactiveCoupon = asyncHandler(async (req, res)=>{
    // taking couponid of the coupon to be deactivated
    const { couponId } = req.params;

    if(!couponId){
        throw new CustomError("Please provide id in the params",400)
    }

    const coupon = await Coupon.findById(couponId)

    if(!coupon){
        throw new CustomError("Cannot find coupon", 400)
    }

    // deactiveting coupons
    coupon.active = false;

    res.status(200).json({
        success: true,
        message: "Coupon deavtivated successfully"
    })

})


/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/

export const deleteCoupon = asyncHandler(async (req, res)=>{
    // taking couponid of the coupon to be deleted
    const { couponId } = req.params;

    if(!couponId){
        throw new CustomError("Please provide id in the params",400)
    }

    const coupon = await Coupon.findByIdAndDelete(couponId)

    if(!coupon){
        throw new CustomError("Could not delete coupon", 400)
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
        coupon
    })

})


/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getAllCoupons = asyncHandler(async (req, res)=>{
    const allCoupons = await Coupon.find()

    if (!allCoupons) {
        throw new CustomError("Could not find coupons", 400)
    }

    res.status(200).json({
        success: true,
        allCoupons
    })

})
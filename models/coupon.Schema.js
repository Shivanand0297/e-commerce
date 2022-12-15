import mongoose, { model } from "mongoose";
const couponsSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Please provide the coupon code"]
        },
        discount: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Coupons", couponsSchema)
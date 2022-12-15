import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus";
import paymentMode from "../utils/paymentMode";
const orderSchema = mongoose.Schema(
    {
        products: {
            type: [
                {
                    productID: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    count: Number,
                    price: Number,
                    // TODO: active status on the products
                }
            ],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        coupon: String,
        transactionID: String,
        status: {
            type: String,
            enum: Object.values(orderStatus),
            default: "ORDERED"
        },
        paymentMode: {
            type: String,
            enum: Object.values(paymentMode),
            default: "COD"
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Order", orderSchema)





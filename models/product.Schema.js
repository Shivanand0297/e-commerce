import mongoose from "mongoose";
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true,
            maxLength: [120, "Product name should be a max of 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            maxLength: [5, "Product price should not be more than 5 digits"]
        },
        description: {
            type: String,
            // use some form of editor - personal assignment (markdown editor)
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Products", productSchema)
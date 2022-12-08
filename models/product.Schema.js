import mongoose from "mongoose";
const productSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Product name is required"]
        }
    }
)

export default mongoose.model("Products", productSchema)
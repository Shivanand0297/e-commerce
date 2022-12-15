import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true, "Please provide a category"],
            trim: true, 
            maxLength: [120, "Collection name should not be more then 120 characters"],
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Collection", collectionSchema)
import Collection from "../models/collection.Schema"
import config from "../config/index"
import CustomError from "../utils/customError"
import asyncHandler from "../services/asyncHandler"


/***************************************************
 * @reques_type POST
 * @createCollection
 * @route http://localhost:5000/api/collection/create
 * @description check for token and populate req.user
 * @parameters   
 * @returns user object
 ***************************************************/

const createCollection = asyncHandler(async(req, res)=>{
    // take collection name from frontend
    const {name} = req.body;

    if(!name){
        throw new CustomError("Collection name is required", 401)
    }

    const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success: true,
        message: "Collection created successfully",
        name
    })
})


const updateCollection = asyncHandler(async(req, res)=>{
    // grab what to update
    const {id: collectionId}  = req.params;

    // updated value from the frontend
    const {name} = req.body;

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name,
        },
        {
            new: true, // give me only updated result
            runValidators: true
        }
    )

    if(!updatedCollection){
        throw new CustomError("collection not found", 400)
    }

    res.status(200).json({
        success: true,
        message: "Collection Updated Successfully",
        updatedCollection
    })
})


export const deleteCollection = asyncHandler(async(req, res)=>{
    const {id: collectionId}  = req.params;

    if(!id){
        throw new CustomError("cannot find colledtion", 400);
    }

    const deletedCollection = await Collection.findByIdAndDelete({collectionId});

    if(!deletedCollection){
        throw new CustomError("collection not deleted", 400)
    }

    // deleteCollection.remove() we can freeup the memory by removing the variable

    res.status(200).json({
        success: true,
        message: "Collection deleted Successfully",
        deletedCollection   //optional , depends on the flow
    })

})


export const getAllCollections = asyncHandler(async (req, res)=>{
    const collections = await Collection.find()

    if(!collections){
        throw new CustomError("collection not found", 400)
    }

    res.status(200).json({
        success: true,
        message: "these are all collections",
        collections 
    })

})
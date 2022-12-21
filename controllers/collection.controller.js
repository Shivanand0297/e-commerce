import Collection from "../models/collection.Schema"
import config from "../config/index"
import CustomError from "../utils/customError"
import asyncHandler from "../services/asyncHandler"


/***************************************************************
 * @reques_type - POST
 * @createCollection
 * @route - http://localhost:5000/api/collection/create
 * @description - takes collection name and create a collection
 * @parameters - name 
 * @returns - collection object
 ***************************************************************/

export const createCollection = asyncHandler(async(req, res)=>{
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
        collection
    })
})

/****************************************************************************************************
 * @reques_type - PUT
 * @updateCollection
 * @route - http://localhost:5000/api/collection/update
 * @description - takes collection id from params and updated data from user to update the collection
 * @parameters - collectionID, name 
 * @returns - updated collection object
 ****************************************************************************************************/

export const updateCollection = asyncHandler(async(req, res)=>{
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


/****************************************************************************************************
 * @reques_type - DELETE
 * @deleteCollection
 * @route - http://localhost:5000/api/collection/delete
 * @description - takes collection id from params and delete the collection
 * @parameters - collectionID
 * @returns - deleted collection object
 ****************************************************************************************************/

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

/****************************************************************************************************
 * @reques_type - GET
 * @getAllCollections
 * @route - http://localhost:5000/api/collection/getCollections
 * @description - return all the collection stored in db
 * @parameters - none
 * @returns - all collection object
 ****************************************************************************************************/

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
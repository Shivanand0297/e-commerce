import Product from "../models/product.Schema"
import formidable from "formidable"
import fs from "fs" // builtin nodejs file system
import { s3FileDelete, s3FileUpload } from "../services/imageUploder"
import Mongoose from "mongoose" // it is different from mongoose
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import config from "../config"


/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @description Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/


export const addProduct = asyncHandler(async (req, res)=>{
    // creating form with options
    const form = formidable({
        multiples: true, // so that multiple files can be selected
        keepExtensions: true // to take images in .jpg or .png formate only
    })

    form.parse(req, async function (err, fields, files){    // fields- all the input from the form, files - image, video etc

        try {
            if(err){
                throw new CustomError(err.message || "somthing went wrong", 500)
            }

           let productID = new Mongoose.Types.ObjectId().toHexString() // by this we are generating the _id whose working is excatly similer to the mongodb id

            // by this we have generated the _id by ourself mongodb just need to store it in the database
            // we have created it by our own because by this method we will have more understanding 
            
            // 34522s2323
            // 34522s2323/photo_1
            // 34522s2323/photo_2
            console.log(fields, typeof(fields), files, typeof(files))

            // check
            if(
                !fields.name ||
                !files.price ||
                !fields.description ||
                !fields.collectionID
            ){
                throw new CustomError("fill all the details", 400)
            }
            

            let imageArrayResp = Promise.all(
                Object.keys(files).map(async (filekey, index)=>{
                    const element = files[filekey]
                    const data = fs.readFileSync(element.filepath)  //from where to upload files from your system
                    console.log(`element: ${element} data: ${data}`);

                    // now upload
                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productID}/photo_${index + 1}.png`,    //unique name for each filename
                        body: data,
                        contentType: element.mimetype
                    })
                    return {
                        secure_url: upload.Location // url of the bucket
                    }
                })
            )    // just to make sure that it returns a array of keys

            /* 
                Promise.all()    
                It simply wraps all of your promises when all of your promises are done
                working. Then it gives you a final response that, hey, all of the
                things are done, all of my promises are complete. Why we are
                using is because we have already enabled multiple file uploads.
                So each file upload will give us return of one promise. And we
                want to wrap all of our files that they should be properly
                uploaded and give us a response back.
            */

            /*
                const data = fs.readFileSync(element.filepath)

                So when user is actually saying, browse and clicking
                on this, then the entire path of your system is also transferring
                with this request. And that's exactly what we get.
                And we want to store that into a variable. Now, so far, we have
                got the reference of this file. This file is not yet uploaded. In
                order to extract any information, we first need to grab
                element. And after this element, element dot, you can access
                anything that you want
            */

                // waiting for the promise to get resolved and storing in another variable
            const imgArray = await imageArrayResp
            
            // creating a product in database
            const product = await Product.create({
                _id: productID,
                photos: imgArray,
                ...fields 
            })

            if(!product){
                throw new CustomError("Product was not created")
            }

            res.status(200).json({
                success: true,
                product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Somthing went wrong"
            })
        }

    })
})

/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 *********************************************************/

export const getAllProduct = asyncHandler(async (req, res)=>{
    const products = await Product.find()
    if(!products){
        throw new CustomError("No products was found", 404)
    }
    res.status(200).json({
        success: true,
        products
    })
})


/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/

export const getProductById = asyncHandler(async (req, res)=>{
    const {productID} = req.params
    const product = await Product.findById(productID)
    if(!product){
        throw new CustomError("No product was found", 404)
    }
    res.status(200).json({
        success: true,
        product
    })
})
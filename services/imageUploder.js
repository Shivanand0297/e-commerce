import s3 from "../config/s3.config";

export const s3FileUpload = async({ bucketName, key, body, contentType })=>{    //key is file unique id
    return await s3.upload({
        Bucket: bucketName,
        Key: key,   // key is unique file names
        Body: body, // body is file to be uploaded
        ContentType: contentType
    }).promise()
}

export const s3FileDelete = async({ bucketName, key })=>{
    return await s3.deleteObject({  //aws treat every file as a object
        Bucket: bucketName,
        Key: key
    }).promise()    // this will return a promise, that will be handled who so ever is calling this method, the promise will return full url of the fule that we can store in the database as a document property
}
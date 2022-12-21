import s3 from "../config/s3.config";

export const s3FileUpload = async({ bucketName, key, body, contentType })=>{    //key is file unique id
    return await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    }).promise()
}

export const s3FileDelete = async({ bucketName, key })=>{
    return await s3.deleteObject({
        Bucket: bucketName,
        Key: key
    }).promise()    // this will return a promise, that will be handled who so ever is calling this method
}
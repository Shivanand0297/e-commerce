import aws from "aws-sdk"
import config from "./index"

const s3 = new aws.S3({
    accessKeyID: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    region: config.S3_REGION
})

export default s3

// we are not mentioning bucket name here because it keeps on 
// changing because this service might be used in different places,
// where maybe you are also expecting user profiles to be
// uploaded. So if you are storing all of them in the same bucket,
// then it's fine. But in the future, there might be a case where all
// the profiles you're storing in a different bucket, all the.
// Product photos you're uploading in a different bucket, so there
// might be a scenario. So, but we can pass on this here as well, if
// you'll read the documentation that is also possible. But we want
// to keep it separate. OKAY, got the intention
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false, 
            message: error.message
        })
    }
}

export default asyncHandler

/* old classic way 
function asyncHandler (fn){
    return async function(req, res, next){
        try {
            await fn(req, res, next)
        } catch (error) {
            res.status(error.code || 500).json({
                success: false, 
                message: error.message
            })
        }
    }
} */
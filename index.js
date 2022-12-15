import mongoose from "mongoose";
import app from "./app";
import config from "./config/index"

// want to run a method which will connect to database immediately
// create a method
// run a method
// iife
// since it is a database call we use async
(async ()=>{    
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("Connected to database");

        // incase of fatal error we can use express event listener on app for error
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error;
        })

        const onListening = ()=>{
            console.log(`app is listening on ${config.PORT}`);
        }
        app.listen(config.PORT, onListening)

    } catch (error) {
        console.log("Error", error);
        throw error // this will kill the execution just like process.exit(1) and also throw custom error message 
    }
})()
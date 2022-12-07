// we can also create .env file and work with it but this is future proffing of the code

import dotenv from "dotenv"

dotenv.config()

// modifying the config 
const config = {    //this will become one mega object in global state
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY  || "30d",
}

export default config
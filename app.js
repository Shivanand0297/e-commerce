import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"



const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())
// morgan logger
app.use(morgan("tiny")) // it print infirmation about our api request, response on the console




export default app
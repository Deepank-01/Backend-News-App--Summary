
import express from 'express'
const app = express()
import user from "./routes/User.js"
import Note from "./routes/Notes.js"
import cookieParser from 'cookie-parser'
// dot env file 
import dotenv from "dotenv"
// env file conncetion
dotenv.config();
const PORT=process.env.PORT || 3000



// db connection 
import dbconnect from "./Connection/dbconnect.js"

// middle wares
app.use(express.json())
app.use(cookieParser())
// routers connection 
app.use("/api/auth",user)
app.use("/api/Note",Note)


// server start
// listen only start the server so on res would  not work in teh case of the res and req

app.listen(PORT,(req,res)=>{
    console.log(
        "Server is running on " , PORT
    )
  
})

// db connecnt 
dbconnect() 
app.get("/",(req,res)=>{
    res.status(200).send(`Server is running  on  ${PORT} `)
})  
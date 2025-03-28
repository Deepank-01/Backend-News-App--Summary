import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const dbconnect=()=>{
    console.log(process.env.MONGODB_URL)
    mongoose.connect(process.env.MONGODB_URL).then(()=>{console.log("Db connected Suucessfully ")})
    .catch((err)=>{console.log("Error in the conncetion with the DB  , error :",err)
        process.exit(1);
    })
}
// module.exports=dbconnect  using the common js 
export default dbconnect;  // export default used in the Es version 
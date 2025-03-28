import mongoose  from "mongoose";
const User_Schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    Notes:{
        type:Number,
        default:0
    }
})
const User=mongoose.model("User",User_Schema);
export default User;

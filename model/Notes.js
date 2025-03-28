import mongoose from "mongoose";

const Notes_schema= new mongoose.Schema({
    // date, text , id 
    text:{
        type:String,
    },
    date:{
     type:Date,
    },
    id:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"User"
    }
})
const Notes=mongoose.model("Notes",Notes_schema)
export default Notes;

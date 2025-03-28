import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv"
import User from '../model/User.js';
dotenv.config()

export const auth=async( req ,res,next)=>{
    try{ 
        // req.header("Authorization").replace("Bearer ", "")
       const token=req.body?.Token || req.cookies?.Token
    //    console.log("this the toekn", token)
       if(!token){
        return res.status(401).json({
            message:"No token founded",
            success:false
        })
       }
       const payload=jwt.verify(token,process.env.Token)
       if(!payload) return res.status(401).json({ message: "Unauthorized - Invalid Token" });
       const user=await User.findById(payload.id).select("-password")
       if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user=user
      next()
    }
    catch(err){
        const token=req.body.token || req.cookies.Token 
        // console.log("Error in protectRoute middleware: ", token);

        res.status(500).json({ message: "Internal server error",
            error:err.message,
            sucess:false});
    }
}
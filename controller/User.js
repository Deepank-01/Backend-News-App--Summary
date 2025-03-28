// contains the login and sign up information using the cookies , jwt token and bearer token 

import User from "../model/User.js";
import bcrypt from "bcrypt";
import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()

//  Todo : Login and signup using the  google auth  
export const Singup =async(req,res)=>{
//    google auth and sing up
try{
    const {name,email,password}=req.body; 
    if(!name || ! email || ! password) {
       return  res.status(400).json({
            message:"Missing data",
            success:false
        })
    }
     var user=await User.findOne({email});
      if(user){
       return  res.status(403).json({
            message:"User alredy exit in the database",
        })
      }
    
    //   hashing the password
    const pas=await bcrypt.hash(password,10);
    const obj={
    name,
    email,
    password:pas
    }
    //   add in the db
    const new_user=await User.create(obj);
    
    // token
    const payload={
        id:new_user._id,
        email:new_user.email,
        name:new_user.name
    
    }
    const token=jwt.sign(payload,process.env.Token,{ expiresIn :"7d"})
    
    // cookie pass 
   const  option={
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true,
    
    }
    res.cookie("Token",token ,option)
    
  return   res.status(200).json({
        message:" Add new user",
        token:token,
        success:true
    })
    
}
catch(err){
  return res.status(400).json({
    message:"Something went wrong in the signup",
    error:err.message,
    success:false
  })
}
}

export const Login=async(req,res)=>{
    try{
      const {email,password}=req.body;
      if( ! email || !password) {
        return res.status(400).json({
            message:"Missing data",
            success:false
        })
    }
    var user=await User.findOne({email});
    if(!user){
        return res.status(404).json({
            message:"User not find , give the correct email and password",
            success:false,
        })
    }
     const conform=await bcrypt.compare(password,user.password) 
     if(!conform){
       return res.status(401).json({
        message:"incorrect password , try again  ",
        success:false
       })
     }
    
    //  create token 
    const payload={
        id:user._id,
        email:user.email,
        name:user.name
    
    }
    const token=jwt.sign(payload,process.env.Token,{ expiresIn :"7d"})
    
    // cookie pass 
    const option={
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true,
    
    }
    res.cookie("Token",token ,option)
    
  return res.status(200).json({
        message:" Login Successful ",
        token:token,
        success:true
    })
    }
    catch(err){
        return res.status(400).json({
            message:"Something went wrong in the Login",
            error:err.message,
            success:false
          })
    }
}
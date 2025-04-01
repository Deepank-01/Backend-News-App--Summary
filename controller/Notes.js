// todo : chat bot 

import User from "../model/User.js";
import getNewsContent from "../Summarize/google.js"

export const Summarize=async (req,res)=>{
try{
 const {url}= req.body
 console.log("THis is the url to summazie  ",url)
 const email=req.user.email;
 const user=await User.findOne({email});
 if(!user){
    return res.status(404).json({
        message:"User not find , unauthozied ",
        success:false,
    })
}
 const sum_text=await getNewsContent(url);
 console.log(sum_text)
 if(!sum_text){
    return res.status(500).json({
        message:"Error in the summization of the text",
        success:false,
    })
 }
 return res.status(200).json({
    summary:sum_text,
    success:true
 })
}
catch(err){
    return res.status(400).json({
        message:"Error in the summization of the news text",
        success:false
     })
}
}

// todo :  chat bot for the summary q/a 
// todo : save in the  database (summaize text )
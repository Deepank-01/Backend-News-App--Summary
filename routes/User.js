import express from "express"
const router=express.Router()

import { Login,Singup } from "../controller/User.js"
import { auth } from "../auth/auth.js"

router.post("/login",Login);
router.post("/Signup",Singup);

export default router
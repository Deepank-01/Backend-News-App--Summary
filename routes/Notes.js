import express from "express"
const router=express.Router()

import { Summarize } from "../controller/Notes.js"
import {auth} from  "../auth/auth.js"
router.post("/summarize",auth,Summarize)
export default router
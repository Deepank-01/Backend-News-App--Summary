

import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractNewsText } from "./scrape.js";  // Ensure path is correct
import {franc} from "franc-min";  // Lightweight language detector
import dotenv from "dotenv"
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getNewsContent =async (text)=> {
    console.log("inside the functoin to summizae")
    const url = text;
    const newsText = await extractNewsText(url);  
    console.log("News Extracted Successfully");
    // console.log(newsText)

    // Detect language of the extracted text
    const detectedLang = franc(newsText);
    console.log("Detected Language:", detectedLang);

    // Prompt in the detected language
    const prompt = detectedLang === "hin" 
        ? `इस लेख को 250 tokens में संक्षेप करें: ${newsText}`
        : `Summarize this article in 250 token : ${newsText}`;
     // 300 टोकन में
    console.log("Summarization in progress...");

    const result = await model.generateContent(prompt);
    // console.log(result?.response?.text());
    return result?.response?.text();
}

export default getNewsContent;
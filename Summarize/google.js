// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { extractNewsText } from "./scrape.js";  // Make sure path is correct

  
// const genAI = new GoogleGenerativeAI("AIzaSyBlk9MCJQx_nFnM8VVHb6peaH7JO6rGnHs");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// var newsText;
// async function getNewsContent() {
//     const url = "https://www.aajtak.in/india/news/story/hm-amit-shah-chairs-high-level-meeting-on-delhi-law-and-order-situation-ntc-rpti-2178369-2025-02-28";
    
//      newsText = await extractNewsText(url);  // Wait for the result before storing
//       console.log("News Extracted succesfully ")
//     // console.log("Extracted News Text:\n", newsText);
//   }
// await getNewsContent();
// const prompt = `Summazie this article in 200 tokens :${newsText}` 
// console.log("Summization working model");
// const result = await model.generateContent(prompt);
// console.log(result?.response?.text())

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
        ? `इस लेख को  संक्षेप करें: ${newsText}`
        : `Summarize this article in 200 token : ${newsText}`;
     // 300 टोकन में
    console.log("Summarization in progress...");

    const result = await model.generateContent(prompt);
    console.log(result?.response?.text());
    return result?.response?.text();
}

export default getNewsContent;
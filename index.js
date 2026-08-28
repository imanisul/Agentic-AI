import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const response = await model.invoke("Write a code to check whether a number is prime or not in Python");

console.log(response.text);
import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

// const response = await model.invoke("Write a code to check whether a number is prime or not in Python");

const stream = await model.stream("Write about Mahatma Gandhi");


for await(const chunk of stream){
    process.stdout.write(chunk.text);
}
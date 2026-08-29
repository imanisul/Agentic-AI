import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage } from "langchain";
import rl from 'readline/promises';
import dotenv from "dotenv";
dotenv.config();

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

// const response = await model.invoke("Write a code to check whether a number is prime or not in Python");

const messages = [];

while(true){
    const userPrompt = await readline.question("User: ");

    messages.push(new HumanMessage(userPrompt));


    const stream = await model.stream(messages);

    let aiResponse = "";

    for await (const chunk of stream) {
        process.stdout.write(chunk.text);

        aiResponse += chunk.text;
    }

    messages.push(new AIMessage(aiResponse));

    process.stdout.write("\n");
    
}
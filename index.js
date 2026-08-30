import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage,AIMessageChunk, SystemMessage, tool , createAgent} from "langchain";
import rl from 'readline/promises';
import dotenv from "dotenv";
import * as z from "zod";
import {tavily} from "@tavily/core";
dotenv.config();


const tvly = tavily({apiKey: process.env.TAVILY_API_KEY});

async function getLatestInformation({query}) {

    const response = await tvly.search(query);
    const results = response.results;
    const content = results.map((result) => result.content).join("\n\n\n");
    return content;
};

const getLatestInformationTool = tool(getLatestInformation, {
    name: "getLatestInformation",
    description: "useful for when you need to get latest information about India and world.",
    schema:z.object({
        query:z.string().describe("query to get latest information about India and world"),
    }) ,
});



const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatMistralAI({
    model:"mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const agent = createAgent({
    model,
    tools: [getLatestInformationTool],
});

// const response = await model.invoke("Write a code to check whether a number is prime or not in Python");

const messages = [
    new SystemMessage(`Your name is AniAI, you help in coding and also mern stack development and also all the latest information about India and world.
        current date is ${new Date().toLocaleDateString()}.
        `),
];

while(true){
    const userPrompt = await readline.question("User: ");

    messages.push(new HumanMessage(userPrompt));


    const stream = await agent.stream({
        messages,
    }, {
        streamMode: "messages"
    });

    let aiResponse = "";

    for await (const [chunk] of stream) {

        if(chunk instanceof AIMessageChunk){
        process.stdout.write(chunk.text);

        aiResponse += chunk.text;
    }}

    messages.push(new AIMessage(aiResponse));

    process.stdout.write("\n");
    
}
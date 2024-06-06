const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Access your API key as an environment variable (see "Set up your API key" above)
const apiKey = process.env.GEMINIAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    console.log("🚀 ~ handler: ~ args:", args.messageBody);
    const res = await run(args.messageBody);
    console.log("🚀 ~ handler: ~ res:", res);

    const messageContent = res;
    console.log("🚀 ~ handler: ~ messageContent:", messageContent);

    const resMutation = await ctx.runMutation(api.messages.sendChatGeminiMessage, {
      content: messageContent ?? "I'm sorry, I don't have a response for that",
      conversation: args.conversation,
      messageType: "text",
    });
    console.log("🚀 ~ handler: ~ resMutation:", resMutation);
  },
});

async function run(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  console.log("result: ", result);
  return result.response.text();
}

export default run;

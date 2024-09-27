"use server";

import { AzureOpenAI } from "openai";
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;
const completionName = process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME;
const apiVersion = "2024-07-01-preview";

function getClient() {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
  });
}
function getClientCompletion() {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: completionName,
  });
}

const printChoices = async (
  completions: Stream<ChatCompletionChunk>
): Promise<void> => {
  for await (const completion of completions) {
    for (const choice of completion.choices) {
      console.log("answer:", choice.delta.content);
    }
  }
};

const transcript = async (preState: any, formData: FormData) => {
  const id = Math.random().toString(36);
  if (
    endpoint === undefined ||
    apiKey === undefined ||
    deploymentName === undefined ||
    completionName === undefined
  ) {
    console.error("Azure credentials not set!");
    return {
      sender: "",
      response: "Azure credentials not set!",
      id,
    };
  }
  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: null,
      response:
        "Sorry, I can't hear what you're saying, please say something, I will help you! ",
      id,
    };
  }

  console.log("== Transcribe Audio Sample ==");

  const client = getClient();
  try {
    const result = await client.audio.transcriptions
      .create(
        {
          file,
          model: "whisper-1",
          temperature: 0,
        },
        { timeout: 10000 }
      )
      .catch((error) => {
        console.log(error);
        return error;
      });

    // ---    get chat completion from Azure OpenAI   ---
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant. You will answer questions and reply 'Sorry, I don't understand what you just said, please say something!' if you do not know the answer.",
      },
      {
        role: "user",
        content: result.text,
      },
    ];
    const clientCompletion = getClientCompletion();
    const completions = await clientCompletion.chat.completions.create(
      {
        // stream: true,
        model: "gpt-4o-2024-08-06",
        messages,
        max_tokens: 128,
      },
      { timeout: 10000 }
    );
    const response = completions.choices[0].message.content;
    return {
      sender: result.text,
      response,
      id,
    };
  } catch (error) {
    return {
      sender: null,
      response: "Sorry, something went wrong, please try again!",
      id,
    };
  }
};

export default transcript;

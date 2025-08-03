// amplify/functions/magic-request/handler.ts
import { Handler } from 'aws-lambda';

type InputEvent = {
  arguments: {
    prompt: string;
  }
}

export const handler: Handler<InputEvent, string> = async (event) => {
  const prompt = event.arguments.prompt;

  // 1. Log the incoming prompt to the console (visible in CloudWatch)
  console.log(`Received prompt: "${prompt}"`);

  // 2. Return a simple message to the client
  const responseMessage = `I received your message: "${prompt}"`;
  
  // The custom query expects a stringified JSON, so we stringify the simple message.
  return JSON.stringify(responseMessage);
};
 
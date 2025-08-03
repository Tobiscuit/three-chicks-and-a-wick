// amplify/functions/magic-request/handler.ts
import { Handler } from 'aws-lambda';

type InputEvent = {
  arguments: {
    message: string;
  }
}

export const handler: Handler<InputEvent, string> = async (event) => {
  const message = event.arguments.message;

  // 1. Log the incoming message to the console (visible in CloudWatch)
  console.log(`Received message: "${message}"`);

  // 2. Return the message back to the client
  const responseMessage = `The backend received your message: "${message}"`;
  
  return responseMessage;
};
 
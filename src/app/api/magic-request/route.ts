// src/app/api/magic-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import outputs from '@root/amplify_outputs.json';

const functionName = outputs.custom.magicRequestFunctionName;
const region = outputs.custom.aws_region; // Corrected from aws_project_region

const lambdaClient = new LambdaClient({ region });

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: JSON.stringify(requestBody)
    });
    
    const { Payload } = await lambdaClient.send(command);
    
    if (!Payload) {
      throw new Error("No payload received from Lambda function.");
    }

    const responseString = new TextDecoder().decode(Payload);
    const lambdaResponse = JSON.parse(responseString);

    if (lambdaResponse.statusCode !== 200) {
        const errorBody = JSON.parse(lambdaResponse.body);
        throw new Error(errorBody.error || `Lambda function returned status code ${lambdaResponse.statusCode}`);
    }

    const finalData = JSON.parse(lambdaResponse.body);

    return NextResponse.json(finalData, { status: 200 });

  } catch (error) {
    console.error('Error in API route:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred while processing your request.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  return {
    candleName: "Test Candle",
    description: "This is a test"
  };
};
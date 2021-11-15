import { APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponse } from '@models/index';

export const responseOk = (result: any): APIGatewayProxyResult => {
  const response: ApiResponse = { result: result ?? null, status: 'ok' };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.CORS,
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response),
  };
};

export const responseError = (message: string): APIGatewayProxyResult => {
  const response: ApiResponse = { message, status: 'error' };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.CORS,
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response),
  };
};
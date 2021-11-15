Shopping List app built with Angular 12, NgRx, Dynamodb, Nodejs, and the Serverless Framework

[See demo](https://d3ezooapg12xk.cloudfront.net/lists)

## Prerequisites to run locally
- Node.js >= 12
- [Serverless Framework](https://github.com/serverless/serverless)
- Angular 12+ CLI `npm install -g @angular/cli`

## Running locally

- Angular app: Scope a terminal to the root of shipping-list-web. Run the command: `npm start` 
- Serverless API: Change the aws profile name in the npm "start" script from `my-aws-profile` to your aws profile with applicable permissions. Scope a terminal to the root of shipping-list-api. Run the command: `npm start`.  The npm start script will start the api on localhost via serverless offline.

> Note - In order to run the api locally via serverless offline, the Dynamodb tables must be created.  The tables can be created manually in an aws account or by deploying the serverless api (recommended), see "Deploying Serverless API".

## Deploying Serverless API

To deploy the serverless application to AWS:
1. Change the aws profile name in the npm "deploy" script.  Change it from `my-aws-profile` to your aws profile with applicable permissions.
2. Run the command: `npm run deploy`

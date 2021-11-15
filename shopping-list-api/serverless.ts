import type { AWS } from '@serverless/typescript';
import { itemFunctions, listFunctions } from '@functions/index';
import { tableLists, tableItems } from '@dbTables/db-tables';

const serverlessConfiguration: AWS = {
  service: 'shopping-list-api',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-openapi-documentation'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "local"}',
    httpApi: {
      cors: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AWS_PROFILE: 'bact',
      AWS_REGION_NAME: 'us-east-1',
      TABLE_NAME_LISTS: '${self:custom.tableNameLists}',
      TABLE_NAME_ITEMS: '${self:custom.tableNameItems}',
      CORS: '${self:custom.cors}'
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: [
              'arn:aws:dynamodb:*:*:table/${self:custom.tableNameLists}',
              'arn:aws:dynamodb:*:*:table/${self:custom.tableNameLists}/index/active-createdOn-index',
              'arn:aws:dynamodb:*:*:table/${self:custom.tableNameItems}',
              'arn:aws:dynamodb:*:*:table/${self:custom.tableNameItems}/index/listId-createdOn-index',
            ],
          }
        ],
      },
    },    
    profile: 'bact'
  },
  functions: {
    ...listFunctions,
    ...itemFunctions
  },
  resources: {
    Resources: {
      ...tableLists,
      ...tableItems
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    tableNameLists: 'shopping-list-lists',
    tableNameItems: 'shopping-list-items',
    cors: '*'
  },
};

module.exports = serverlessConfiguration;

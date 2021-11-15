export const tableLists = {
  ['dbLists']: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      ['TableName']: '${self:custom.tableNameLists}',
      ['AttributeDefinitions']: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        },
        {
          AttributeName: 'active',
          AttributeType: 'N'
        },
        {
          AttributeName: 'createdOn',
          AttributeType: 'N'
        }
      ],
      ['KeySchema']: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      ['GlobalSecondaryIndexes']: [{
        ['IndexName']: 'active-createdOn-index',
        ['KeySchema']: [
          {
            AttributeName: 'active',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'createdOn',
            KeyType: 'RANGE'
          }
        ],
        ['Projection']: {
          ProjectionType: 'ALL'
        }
      }],
      ['BillingMode']: 'PAY_PER_REQUEST'        
    },
  }
};

export const tableItems = {
  ['dbItems']: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      ['TableName']: '${self:custom.tableNameItems}',
      ['AttributeDefinitions']: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        },
        {
          AttributeName: 'listId',
          AttributeType: 'S'
        },
        {
          AttributeName: 'createdOn',
          AttributeType: 'N'
        }        
      ],
      ['KeySchema']: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        }
      ],
      ['GlobalSecondaryIndexes']: [{
        ['IndexName']: 'listId-createdOn-index',
        ['KeySchema']: [
          {
            AttributeName: 'listId',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'createdOn',
            KeyType: 'RANGE'
          }
        ],
        ['Projection']: {
          ProjectionType: 'ALL'
        }
      }],
      ['BillingMode']: 'PAY_PER_REQUEST'        
    },
  }
};
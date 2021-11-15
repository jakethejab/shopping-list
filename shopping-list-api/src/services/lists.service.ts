import { DynamoDB } from 'aws-sdk';
import { DeleteItemInput, DocumentClient, QueryInput, UpdateItemInput } from 'aws-sdk/clients/dynamodb';
import { nanoid } from 'nanoid';
import { List } from '@models/index';
import { getUnixDate } from '@shared/index';

export class ListsService {
  dynamodbClient: DocumentClient;

  constructor() {
    this.dynamodbClient = new DynamoDB.DocumentClient({ region: process.env.AWS_REGION_NAME });
  }

  /**
   * Creates a new list
   * @param name List name
   * @returns The newly created list
   */
  public async createList(name: string): Promise<List> {
    const list: List = {
      id: nanoid(),
      name,
      createdOn: getUnixDate(),
      itemsTotal: 0,
      itemsChecked: 0,
      active: 1 // hard coded to 1 for use in index query
    }

    const params = {
      TableName: process.env.TABLE_NAME_LISTS,
      Item: list
    };
  
    await this.dynamodbClient.put(params).promise();

    return list;
  }

  /**
   * Gets a list by id
   * @param id The id of the list
   * @returns The list object
   */
  public async getList(id: string): Promise<List> {
    const params: QueryInput = {
      TableName: process.env.TABLE_NAME_LISTS,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id as any
      }
    };

    const { Items: lists } = await this.dynamodbClient.query(params).promise();

    let list = null;
    if (lists && Array.isArray(lists) && lists.length > 0) {
      [list] = lists;
    }

    return list;
  }

  /**
   * Gets a lists of shopping lists
   * @returns An array of list objects
   */
  public async getLists(): Promise<List[]> {
    const params: QueryInput = {
      TableName: process.env.TABLE_NAME_LISTS,
      IndexName: 'active-createdOn-index',
      KeyConditionExpression: 'active = :active',
      ExpressionAttributeValues: {
        ':active': 1 as any // Active is used to query ALL lists, without having to use scan
      },
      ScanIndexForward: true // Order by createdOn asc
    };

    const { Items: lists } = await this.dynamodbClient.query(params).promise();

    return lists.map(l => { 
      return {
        id: l.id,
        name: l.name,
        itemsTotal: l.itemsTotal,
        itemsChecked: l.itemsChecked,
        createdOn: l.createdOn,
        totalPrice: l.totalPrice
      }
    });
  }

  /**
   * Updates a List
   * @param id List id
   * @param name List name
   */
  public async updateList(id: string, name: string): Promise<void> {
    const params: UpdateItemInput = {
      TableName: process.env.TABLE_NAME_LISTS,
      Key: {
        'id': id as any
      },
      UpdateExpression: "set #name = :listName",
      ExpressionAttributeValues: {
        ':listName': name as any
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    };

    await this.dynamodbClient.update(params).promise();
  }

  /**
   * Deletes a List
   * @param id List id
   */
  public async deleteList(id: string): Promise<void> {
    const params: DeleteItemInput = {
      TableName: process.env.TABLE_NAME_LISTS,
      Key: {
        'id': id as any
      }
    };
    
    await this.dynamodbClient.delete(params).promise();
  }
}
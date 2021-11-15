import { DynamoDB } from 'aws-sdk';
import { DeleteItemInput, DocumentClient, QueryInput } from 'aws-sdk/clients/dynamodb';
import { nanoid } from 'nanoid';
import { Item } from '@models/index';
import { getUnixDate } from '@shared/index';

export class ItemsService {
  private dynamodbClient: DocumentClient;

  constructor() {
    this.dynamodbClient = new DynamoDB.DocumentClient({ region: process.env.AWS_REGION_NAME });
  }

  /**
   * Creates a new item
   * @param listId List Id
   * @param name Item name
   * @returns Newly created Item
   */
  public async createItem(listId: string, name: string): Promise<Item> {
    const item: Item = {
      id: nanoid(),
      listId,
      name,
      createdOn: getUnixDate(),
      checked: false,
      quantity: 1,
      price: 0
    }

    const params = {
      TableName: process.env.TABLE_NAME_ITEMS,
      Item: item
    };
  
    await this.dynamodbClient.put(params).promise();

    await this.setListTotals(listId);

    return item;
  }

  /**
   * Gets a array of Item objects by List id
   * @param listId List id
   * @returns An array of Item objects
   */
  public async getItems(listId: string): Promise<Item[]> {
    const params: QueryInput = {
      TableName: process.env.TABLE_NAME_ITEMS,
      IndexName: 'listId-createdOn-index',
      KeyConditionExpression: 'listId = :listId',
      ExpressionAttributeValues: {
        ':listId': listId as any
      },
      ScanIndexForward: true
    };

    const { Items: items } = await this.dynamodbClient.query(params).promise();

    return items.map(i => { 
      return {
        id: i.id,
        listId: i.listId,
        name: i.name,
        createdOn: i.createdOn,
        checked: i.checked,
        quantity: i.quantity,
        price: i.price
      }
    });
  }

  /**
   * Updates an Item
   * @param listId List id
   * @param id Item id
   * @param name 
   * @param quantity 
   * @param price 
   */
  public async updateItem(listId: string, id: string, name: string, quantity: number, price: number): Promise<void> {
    const params = {
      TableName: process.env.TABLE_NAME_ITEMS,
      Key: {
        'id': id
      },
      UpdateExpression: "set #name = :itemName, quantity = :quantity, price = :price",
      ExpressionAttributeValues: {
        ':itemName': name,
        ':quantity': quantity,
        ':price': price
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    };

    await this.dynamodbClient.update(params).promise();

    await this.setListTotals(listId);
  }

  /**
   * Deletes an Item. Hard delete, cannot be undone.
   * @param listId List id
   * @param id Item id
   */
  public async deleteItem(listId: string, id: string): Promise<void> {
    const params: DeleteItemInput = {
      TableName: process.env.TABLE_NAME_ITEMS,
      Key: {
        'id': id as any
      }
    };
    
    await this.dynamodbClient.delete(params).promise();

    await this.setListTotals(listId);
  }

  /**
   * Sets an Item's checked property
   * @param listId List id
   * @param id Item id
   * @param checked
   */
  public async checkItem(listId: string, id: string, checked: boolean): Promise<void> {
    const params = {
      TableName: process.env.TABLE_NAME_ITEMS,
      Key: {
        'id': id
      },
      UpdateExpression: "set checked = :checked",
      ExpressionAttributeValues: {
        ':checked': checked
      }
    };

    await this.dynamodbClient.update(params).promise();

    await this.setListTotals(listId);
  }

  /**
   * Sets the total items, checked items, and total price for a List.
   * This method should be called after created an item, checking an item, updating an item, and deleting an item
   * @param listId List id
   */
  private async setListTotals(listId: string): Promise<void> {
    const params: QueryInput = {
      TableName: process.env.TABLE_NAME_ITEMS,
      IndexName: 'listId-createdOn-index',
      KeyConditionExpression: 'listId = :listId',
      ProjectionExpression: 'id, price, checked',
      ExpressionAttributeValues: {
        ':listId': listId as any
      }
    };

    // Gets an array of shopping list items
    const { Items: items } = await this.dynamodbClient.query(params).promise();

    if (items && Array.isArray(items) && items.length > 0) {
      // Gets checked & unchecked item arrays
      const itemsChecked = items.filter(i => i.checked);
      const itemsUnchecked = items.filter(i => !i.checked);

      // Gets checked & unchecked total price
      const totalPriceChecked = this.getTotalPrice(itemsChecked as Item[]);
      const totalPriceUnchecked = this.getTotalPrice(itemsUnchecked as Item[]);

      // Updates the shopping list with new totals
      const params = {
        TableName: process.env.TABLE_NAME_LISTS,
        Key: {
          'id': listId
        },
        UpdateExpression: "set itemsTotal = :itemsTotal, itemsChecked = :itemsChecked, totalPrice = :totalPrice",
        ExpressionAttributeValues: {
          ':itemsTotal': items.length,
          ':itemsChecked': itemsChecked.length,
          ':totalPrice': { checked: totalPriceChecked, unchecked: totalPriceUnchecked }
        }
      };
  
      await this.dynamodbClient.update(params).promise();
    }
  }

  /**
   * Sums up item price
   * @param items An array of Item objects
   * @returns Items total price
   */
  private getTotalPrice(items: Item[]): number {
    return items.reduce((accumulator: number, item: any) => {
      return accumulator + item.price;
    }, 0);
  }
}
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { responseOk, responseError } from '@shared/response';
import { Logger, LoggerColor } from '@shared/logger';
import { ListsService, ItemsService } from '@services/index';

// Instantiates outside of handler so that the dynamodb connection can be reused within the lambda container
const listsService = new ListsService();
const itemsService = new ItemsService();
const logger = new Logger('Items', LoggerColor.Grey);

export const getItems: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const listId = event.pathParameters.listId;

  try {
    const results = await Promise.all([
      listsService.getList(listId),
      itemsService.getItems(listId)
    ]);

    const [list, items] = results;

    return responseOk({
      list,
      items
    }); 
  } catch (error) {
    logger.error('getItems', error);

    return responseError('There was an error getting items');
  }
};

export const createItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const listId = event.pathParameters.listId;

  const { name } = JSON.parse(event.body ?? '{}');

  // Validation
  if (!name || name.trim() === '') {
    return responseError('Please provide an item name');
  }

  try {
    const item = await itemsService.createItem(listId, name);

    return responseOk(item);
  } catch (error) {
    logger.error('createItem', error);

    return responseError('There was an error creating the item');
  }
};

export const updateItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const listId = event.pathParameters.listId;
  const id = event.pathParameters.itemId;
  const { name, quantity, price } = JSON.parse(event.body ?? '{}');

  // Validation
  if (!name || name.trim() === '' || !quantity || quantity < 1 || !price) {
    return responseError('Please provide item name, quantity, and price');
  }

  try {
    await itemsService.updateItem(listId, id, name, quantity, price);
  } catch (error) {
    logger.error('updateItem', error);
  }

  return responseOk(null);
};

export const deleteItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const listId = event.pathParameters.listId;
  const id = event.pathParameters.itemId;

  try {
    await itemsService.deleteItem(listId, id);
  } catch (error) {
    logger.error('deleteItem', error);
  }

  return responseOk(null);
};

export const checkItem: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const listId = event.pathParameters.listId;
  const id = event.pathParameters.itemId;
  const { checked } = JSON.parse(event.body ?? '{}');

  try {
    await itemsService.checkItem(listId, id, !!checked);
  } catch (error) {
    logger.error('checkItem', error);
  }

  return responseOk(null);
};
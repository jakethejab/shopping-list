import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { responseOk, responseError } from '@shared/response';
import { Logger, LoggerColor } from '@shared/logger';
import { ItemsService, ListsService } from '@services/index';

// Instantiates outside of handler so that the dynamodb connection can be reused within the lambda container
const listService = new ListsService();
const itemsService = new ItemsService();
const logger = new Logger('Lists', LoggerColor.Cyan);

export const getLists: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const lists = await listService.getLists();

    return responseOk(lists); 
  } catch (error) {
    logger.error('getLists', error);

    return responseError('There was an error getting lists');
  }
};

export const createList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { name } = JSON.parse(event.body ?? '{}');

  // Validation
  if (!name || name.trim() === '') {
    return responseError('Please provide a list name');
  }

  try {
    const list = await listService.createList(name);

    return responseOk(list);
  } catch (error) {
    logger.error('createList', error);

    return responseError('There was an error creating the list');
  }
};

export const updateList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters.id;
  const { name } = JSON.parse(event.body ?? '{}');

  // Validation
  if (!name || name.trim() === '') {
    return responseError('Please provide a list name');
  }

  try {
    await listService.updateList(id, name);
  } catch (error) {
    logger.error('updateList', error);
  }

  return responseOk(null);
};

export const deleteList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters.id;

  try {
    const items = await itemsService.getItems(id);
    const deleteItems = items.map(i => itemsService.deleteItem(id, i.id));

    // Deletes all of the items in the list
    await Promise.all(deleteItems);

    // Deletes the list
    await listService.deleteList(id);
  } catch (error) {
    logger.error('deleteList', error);
  }

  return responseOk(null);
};
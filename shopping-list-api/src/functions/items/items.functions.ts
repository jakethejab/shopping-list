import { handlerPath } from '@shared/handlerResolver';

const path = handlerPath(__dirname);

export const getItems = {
  handler: `${path}/items.getItems`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/lists/{listId}/items'
      }
    }
  ]
};

export const createItem = {
  handler: `${path}/items.createItem`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/lists/{listId}/items'
      }
    }
  ]
};

export const updateItem = {
  handler: `${path}/items.updateItem`,
  events: [
    {
      httpApi: {
        method: 'put',
        path: '/lists/{listId}/items/{itemId}'
      }
    }
  ]
};

export const deleteItem = {
  handler: `${path}/items.deleteItem`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/lists/{listId}/items/{itemId}'
      }
    }
  ]
};

export const checkItem = {
  handler: `${path}/items.checkItem`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/lists/{listId}/items/{itemId}/check'
      }
    }
  ]
};
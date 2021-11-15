import { handlerPath } from '@shared/handlerResolver';

const path = handlerPath(__dirname);

export const getLists = {
  handler: `${path}/lists.getLists`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/lists'
      }
    }
  ]
};

export const createList = {
  handler: `${path}/lists.createList`,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/lists'
      }
    }
  ]
};

export const updateList = {
  handler: `${path}/lists.updateList`,
  events: [
    {
      httpApi: {
        method: 'put',
        path: '/lists/{id}'
      }
    }
  ]
};

export const deleteList = {
  handler: `${path}/lists.deleteList`,
  events: [
    {
      httpApi: {
        method: 'delete',
        path: '/lists/{id}'
      }
    }
  ]
};
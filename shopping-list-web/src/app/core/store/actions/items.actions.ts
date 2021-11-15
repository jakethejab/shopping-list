import { createAction, props } from '@ngrx/store';
import { List, Item } from '@core/models';

export const initItems = createAction(
  '[Items] Init Items',
  props<{ listId: string }>()
);

export const setItemsInitializing = createAction(
  '[Items] Set Items Initializing',
  props<{ listId: string, initializing: boolean }>()
);

export const initItemsSuccess = createAction(
  '[Items] Init Items Success',
  props<{ list: List, items: Item[] }>()
);

export const checkItem = createAction(
  '[Items] Check Item',
  props<{ listId: string, itemId: string, checked: boolean }>()
);

export const createItem = createAction(
  '[Items] Create Item',
  props<{ listId: string, name: string }>()
);

export const updateItem = createAction(
  '[Items] Update Item',
  props<{ listId: string, itemId: string, name: string, quantity: number, price: number }>()
);

export const createItemSuccess = createAction(
  '[Items] Create Item Success',
  props<{ listId: string, item: Item }>()
);

export const createItemError = createAction(
  '[Items] Create Item Error',
  props<{ title?: string, message: string }>()
);

export const deleteItem = createAction(
  '[Items] Delete Item',
  props<{ listId: string, itemId: string }>()
);

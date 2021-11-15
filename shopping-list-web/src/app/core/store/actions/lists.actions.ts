import { List } from '@core/models';
import { createAction, props } from '@ngrx/store';

export const initLists = createAction(
  '[Lists] Init Lists'
);

export const setListsInitializing = createAction(
  '[Lists] Set Lists Initializing',
  props<{ initializing: boolean }>()
);

export const initListsSuccess = createAction(
  '[Lists] Init Lists Success',
  props<{ lists: List[] }>()
);

export const createList = createAction(
  '[Lists] Create List',
  props<{ name: string }>()
);

export const updateList = createAction(
  '[Lists] Update List',
  props<{ listId: string, name: string }>()
);

export const createListSuccess = createAction(
  '[Lists] Create List Success',
  props<{ list: List }>()
);

export const createListError = createAction(
  '[Items] Create List Error',
  props<{ title?: string, message: string }>()
);

export const addLists = createAction(
  '[Lists] Add Lists',
  props<{ lists: List[] }>()
);

export const deleteList = createAction(
  '[Lists] Delete List',
  props<{ listId: string }>()
);

export const setListTotals = createAction(
  '[Lists] Set List Totals',
  props<{ listId: string, itemsTotal: number, itemsChecked: number, totalPrice: { checked: number, unchecked: number } }>()
);

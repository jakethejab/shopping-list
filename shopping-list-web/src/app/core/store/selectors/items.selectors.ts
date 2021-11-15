import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import {
  AppState,
  selectState
} from '@store/reducers';
import * as fromItems from '@core/store/reducers/items.reducer';
import { Item } from '@core/models/index';

export const selectItemsState = createSelector(selectState, (state: AppState) => state.items);

export const selectItemsEntities = createSelector(
  selectItemsState,
  fromItems.selectItemsEntities
);

export const selectItems = (listId: string) => createSelector(
  selectItemsEntities,
  (items: Dictionary<Item>) => {
    if (items) {
      return Object.keys(items).map((id) => items[id]).filter(i => i.listId === listId) as Item[];
    } else {
      return [];
    }
  }
);

export const selectItemsSorted = (listId: string) => createSelector(
  selectItems(listId),
  (items: Item[]) => {
    return items.sort(compare);
  }
);

export const selectItem = (itemId: string) => createSelector(
  selectItemsEntities,
  (items: Dictionary<Item>) => {
    const item = items[itemId];
    if (!item) {
      return null;
    } else {
      return item;
    }
  }
);

export const selectIsCreateLoading = () => createSelector(
  selectItemsState,
  (state) => {
    return !!state.isCreateLoading;
  }
);

const compare = (a: Item, b: Item) => {
  if (a.createdOn < b.createdOn) {
    return -1;
  }

  if (a.createdOn > b.createdOn) {
    return 1;
  }

  return 0;
}
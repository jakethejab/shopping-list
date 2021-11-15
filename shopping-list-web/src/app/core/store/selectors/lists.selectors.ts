import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import {
  AppState,
  selectState
} from '@store/reducers';
import * as fromLists from '@core/store/reducers/lists.reducer';
import { List } from '@core/models/index';

export const selectListsState = createSelector(selectState, (state: AppState) => state.lists);

export const selectListsEntities = createSelector(
  selectListsState,
  fromLists.selectListsEntities
);

export const selectLists = createSelector(
  selectListsEntities,
  (lists: Dictionary<List>) => {
    if (lists) {
      return Object.keys(lists).map((id) => lists[id]) as List[];
    } else {
      return [];
    }
  }
);

export const selectListsSorted = createSelector(
  selectLists,
  (lists: List[]) => {
    return lists.sort(compare);
  }
);

export const selectList = (listId: string) => createSelector(
  selectListsEntities,
  (lists?: Dictionary<List>) => {
    const list = lists[listId];
    if (!list) {
      return null;
    } else {
      return list;
    }
  }
);

export const selectIsInitializing = () => createSelector(
  selectListsState,
  (state) => {
    return !!state.isInitializing;
  }
);

export const selectItemsInitialized = (listId: string) => createSelector(
  selectListsEntities,
  (lists?: Dictionary<List>) => {
    return !!lists[listId]?.itemsInitialized;
  }
);

export const selectIsItemsInitializing = (listId: string) => createSelector(
  selectListsEntities,
  (lists?: Dictionary<List>) => {
    return !!lists[listId]?.isItemsInitializing;
  }
);

export const selectListIsCreateLoading = () => createSelector(
  selectListsState,
  (state) => {
    return !!state.isCreateLoading;
  }
);

const compare = (a: List, b: List) => {
  if (a.createdOn < b.createdOn) {
    return -1;
  }

  if (a.createdOn > b.createdOn) {
    return 1;
  }

  return 0;
}
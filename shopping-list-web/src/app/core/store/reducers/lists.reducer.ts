import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { List } from '@core/models';
import { addLists, initLists, initListsSuccess, setListsInitializing, initItems, setItemsInitializing, initItemsSuccess, setListTotals, createList, createListSuccess, updateList, deleteList, createListError } from '@store/actions';

export interface State extends EntityState<List> {
  isInitializing?: boolean;
  initialized?: boolean;
  isCreateLoading?: boolean;
}

export const adapter: EntityAdapter<List> = createEntityAdapter<List>();

export const initialState: State = adapter.getInitialState();

const listReducer = createReducer(
  initialState,

  on(initLists, (state) => {
    return { ...state, isInitializing: true };
  }),

  on(setListsInitializing, (state, { initializing }) => {
    return { ...state, isInitializing: initializing };
  }),

  on(initListsSuccess, (state) => {
    return { ...state, isInitializing: false, initialized: true };
  }),

  on(initListsSuccess, (state, { lists }) => {
    return adapter.upsertMany(lists, state);
  }),

  on(addLists, (state, { lists }) => {
    return adapter.addMany(lists, state);
  }),

  on(initItems, (state, { listId }) => {
    return adapter.upsertOne({
      id: listId,
      isItemsInitializing: true
    }, state);
  }),

  on(setItemsInitializing, (state, { listId, initializing }) => {
    return adapter.updateOne({
      id: listId,
      changes: {
        isItemsInitializing: initializing
      }
    }, state);
  }),

  on(initItemsSuccess, (state, { list }) => {
    return adapter.updateOne({
      id: list.id,
      changes: {
        ...list,
        itemsInitialized: true,
        isItemsInitializing: false
      }
    }, state);
  }),

  on(setListTotals, (state, { listId, itemsChecked, itemsTotal, totalPrice }) => {
    return adapter.updateOne({
      id: listId,
      changes: {
        itemsChecked,
        itemsTotal,
        totalPrice
      }
    }, state);
  }),

  on(createList, (state) => {
    return { ...state, isCreateLoading: true };
  }),

  on(createListSuccess, (state) => {
    return { ...state, isCreateLoading: false };
  }),

  on(createListError, (state) => {
    return { ...state, isCreateLoading: false };
  }),

  on(createListSuccess, (state, { list }) => {
    return adapter.addOne(list, state);
  }),

  on(updateList, (state, { listId, name }) => {
    return adapter.updateOne({
      id: listId,
      changes: {
        name
      }
    }, state);
  }),

  on(deleteList, (state, { listId }) => {
    return adapter.removeOne(listId, state);
  }),  
);

export const reducer = (state: State | undefined, action: Action) => {
  return listReducer(state, action);
};

const {
  selectIds,
  selectEntities
} = adapter.getSelectors();

export const selectListsIds = selectIds;
export const selectListsEntities = selectEntities;

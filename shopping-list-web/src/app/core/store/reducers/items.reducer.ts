import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Item } from '@core/models';
import { initItemsSuccess, checkItem, createItem, createItemSuccess, deleteItem, updateItem, createItemError } from '@store/actions';

export interface State extends EntityState<Item> {
  isCreateLoading?: boolean;
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: State = adapter.getInitialState();

const itemsReducer = createReducer(
  initialState,

  on(initItemsSuccess, (state, { items }) => {
    return adapter.addMany(items, state);
  }),

  on(checkItem, (state, { itemId, checked }) => {
    return adapter.updateOne({
      id: itemId,
      changes: {
        checked: checked
      }
    }, state);
  }),
  
  on(createItem, (state) => {
    return { ...state, isCreateLoading: true };
  }),

  on(updateItem, (state, { itemId, name, quantity, price }) => {
    return adapter.updateOne({
      id: itemId,
      changes: {
        name,
        quantity,
        price
      }
    }, state);
  }), 

  on(createItemSuccess, (state) => {
    return { ...state, isCreateLoading: false };
  }),

  on(createItemError, (state) => {
    return { ...state, isCreateLoading: false };
  }),

  on(createItemSuccess, (state, { item }) => {
    return adapter.addOne(item, state);
  }),

  on(deleteItem, (state, { listId, itemId }) => {
    return adapter.removeOne(itemId, state);
  }),  
);

export const reducer = (state: State | undefined, action: Action) => {
  return itemsReducer(state, action);
};

const {
  selectIds,
  selectEntities
} = adapter.getSelectors();

export const selectItemsIds = selectIds;
export const selectItemsEntities = selectEntities;

import { ActionReducerMap } from '@ngrx/store';
import * as fromLists from './lists.reducer';
import * as fromItems from './items.reducer';

export interface AppState {
  lists: fromLists.State;
  items: fromItems.State;
}

export const selectState = (state: AppState) => state;

export const reducers: ActionReducerMap<AppState> = {
  lists: fromLists.reducer,
  items: fromItems.reducer
};
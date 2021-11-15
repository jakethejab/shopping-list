import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ApiService } from '@core/services';
import { initItems, initItemsSuccess, checkItem, setItemsInitializing, createItem, createItemSuccess, displayError, deleteItem, updateItem, createItemError } from '@store/actions';
import { AppState } from '@store/reducers';
import { selectItemsInitialized, selectList, selectListsState } from '@store/selectors';

@Injectable()
export class ItemsEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>, private api: ApiService) { }

  initItems$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initItems),
        mergeMap(action =>
          of(action.listId).pipe(
            withLatestFrom(this.store$.pipe(select(selectItemsInitialized(action.listId))))
          )
        ),
        switchMap(([listId, itemsInitialized]) => {
          if (itemsInitialized) {
            return of(setItemsInitializing({ listId, initializing: false }));
          } else {
            return this.api.getItems(listId).pipe(
              map((response) => initItemsSuccess({ list: response.result.list, items: response.result.items ?? [] }))
            );
          }
        })
      )
  );

  checkItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(checkItem),
        mergeMap(action => {
          return this.api.checkItem(action.listId, action.itemId, action.checked);
        }),
      ),
    { dispatch: false }
  );

  updateItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateItem),
        mergeMap(action => {
          return this.api.updateItem(
            action.listId,
            action.itemId,
            action.name,
            action.quantity,
            action.price
          )
        }),
      ),
    { dispatch: false }
  );    

  deleteItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteItem),
        mergeMap(action => {
          return this.api.deleteItem(action.listId, action.itemId)
        }),
      ),
    { dispatch: false }
  );  

  createItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createItem),
        mergeMap(action => {
          return this.api.createItem(action.listId, action.name).pipe(
            map((response) => {
              if (response.status === 'ok') {
                return createItemSuccess({ listId: action.listId, item: response.result });
              } else {
                return createItemError({ title: 'Error creating Item', message: response.message });
              }
            })
          );
        }),
      )
  );

  displayNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createItemError),
        map((action) => {
          return displayError({ title: action.title, message: action.message });
        })
      )
  );  

}

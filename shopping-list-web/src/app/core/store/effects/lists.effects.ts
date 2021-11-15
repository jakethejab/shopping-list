import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ApiService } from '@core/services';
import { initLists, setListsInitializing, initListsSuccess, checkItem, setListTotals, createItem, deleteItem, createItemSuccess, updateItem, createList, displayError, createListSuccess, updateList, displaySuccess, deleteList, createListError } from '@store/actions';
import { AppState } from '@store/reducers';
import { selectItems, selectListsState } from '@store/selectors';
import { Item } from '@core/models';

@Injectable()
export class ListsEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>, private api: ApiService) { }

  initLists$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initLists),
        withLatestFrom(this.store$.pipe(select(selectListsState))),
        switchMap(([action, state]) => {
          if (state.initialized) {
            return of(setListsInitializing({ initializing: false }));
          } else {
            return this.api.getLists().pipe(
              map((response) => initListsSuccess({ lists: response.result ?? [] }))
            );
          }
        })
      )
  );

  createItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createList),
        mergeMap(action => {
          return this.api.createList(action.name).pipe(
            map((response) => {
              if (response.status === 'ok') {
                return createListSuccess({ list: response.result });
              } else {
                return createListError({ title: 'Error creating List', message: response.message });
              }
            })
          );
        }),
      )
  );

  displayNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createListSuccess, createListError),
        map((action) => {
          if (action.type === '[Lists] Create List Success') {
            return displaySuccess({ message: `${action.list.name} created successfully` });
          } else {
            return displayError({ title: action.title, message: action.message });
          }
        })
      )
  );  

  updateList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateList),
        mergeMap(action => {
          return this.api.updateList(
            action.listId,
            action.name
          )
        }),
      ),
    { dispatch: false }
  );

  deleteList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteList),
        mergeMap(action => {
          return this.api.deleteList(action.listId)
        }),
      ),
    { dispatch: false }
  );  

  setListTotals$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(checkItem, updateItem, deleteItem, createItemSuccess),
        mergeMap(action =>
          of(action.listId).pipe(
            withLatestFrom(this.store$.pipe(select(selectItems(action.listId))))
          )
        ),
        switchMap(([listId, items]) => {
          const itemsChecked = items.filter(i => i.checked);
          const itemsUnchecked = items.filter(i => !i.checked);
    
          // Gets checked & unchecked total price
          const totalPriceChecked = this.getTotalPrice(itemsChecked as Item[]);
          const totalPriceUnchecked = this.getTotalPrice(itemsUnchecked as Item[]);

          return of(setListTotals({ 
            listId,
            itemsTotal: items.length,
            itemsChecked: itemsChecked.length,
            totalPrice: {
              checked: totalPriceChecked,
              unchecked: totalPriceUnchecked
            }
          }));
        })
      )
  );

  private getTotalPrice(items: Item[]): number {
    return items.reduce((accumulator: number, item: any) => {
      return accumulator + item.price;
    }, 0);
  }

}

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { concat, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Item, List } from '@core/models';
import { AppState } from '@store/reducers';
import { initItems, checkItem, deleteItem } from '@store/actions';
import { selectIsItemsInitializing, selectItems, selectItemsSorted, selectList } from '@store/selectors';
import { EditItemComponent } from '../../components/edit-item/edit-item.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {
  listId: string;
  isItemsInitializing$: Observable<boolean>;
  items$: Observable<Item[]>;
  list$: Observable<List>;
  routeSub: Subscription;
  // Tracks by item id. Prevents the entire list from being re-rendered on change.
  itemsTrackByFn: TrackByFunction<Item> = (_, item) => item.id;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.listId = params.listId;

      this.store.dispatch(initItems({ listId: params.listId }));

      this.isItemsInitializing$ = this.store.pipe(
        select(selectIsItemsInitializing(params.listId))
      );

      this.list$ = this.store.pipe(
        select(selectList(params.listId))
      );

      this.items$ = this.store.pipe(
        select(selectItemsSorted(params.listId))
      );
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  onMenuClick(e: any): void {
    e.preventDefault();
    e.stopPropagation();
  }

  onItemCheck(e: MatSelectionListChange) {
    this.store.dispatch(checkItem({ 
      listId: this.listId,
      itemId: e.options[0].value,
      checked: e.options[0].selected
    }));
  }

  deleteItem(itemId: string, name: string): void {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.store.dispatch(deleteItem({ 
        listId: this.listId,
        itemId
      }));    
    }
  }

  showEditItem(itemId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.width = '440px';
    dialogConfig.data = { listId: this.listId, itemId: itemId };
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(EditItemComponent, dialogConfig);
  }

}

import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concat, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { initLists } from '@store/actions';
import { AppState } from '@store/reducers';
import { selectIsInitializing, selectLists, selectListsSorted } from '@store/selectors';
import { List } from '@core/models';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListsComponent implements OnInit {
  lists$: Observable<List[]>;
  isInitializing$: Observable<boolean>;
  // Tracks by list id. Prevents the entire list from being re-rendered on change.
  listsTrackByFn: TrackByFunction<List> = (_, list) => list.id;

  constructor(private store: Store<AppState>) { 
    this.store.dispatch(initLists());

    this.lists$ = this.store.pipe(
      select(selectListsSorted)
    );
  }

  ngOnInit(): void {
    this.isInitializing$ = this.store.pipe(
      select(selectIsInitializing())
    );
  }

}

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@store/reducers';
import { createItem } from '@store/actions';
import { selectIsCreateLoading } from '@store/selectors';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddItemComponent implements OnInit {
  @ViewChild('addItemInput', { static: false }) addItemInput: ElementRef;
  @Input() listId: string;
  isCreateLoading$: Observable<boolean>;

  formGroup = new FormGroup({
    name: new FormControl('')
  });

  get name(): AbstractControl {
    return this.formGroup.get('name');
  }

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.isCreateLoading$ = this.store.pipe(
      select(selectIsCreateLoading())
    );
  }

  addItem(): void {
    this.store.dispatch(createItem({
      listId: this.listId,
      name: this.name.value
    }));

    this.addItemInput.nativeElement.focus();
    this.name.setValue('');
    this.name.markAsPristine();
    this.formGroup.reset();
  }
}

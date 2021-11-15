import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '@store/reducers';
import { Item } from '@core/models';
import { Observable } from 'rxjs/internal/Observable';
import { selectItem } from '@store/selectors';
import { updateItem } from '@store/actions';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  listId: string;
  itemId: string;
  item$: Observable<Item>;
  itemSub: Subscription;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    price: new FormControl(0, [Validators.required]),
  });

  get name() {
    return this.formGroup.get('name');
  }

  get quantity() {
    return this.formGroup.get('quantity');
  }
  
  get price() {
    return this.formGroup.get('price');
  }  
  
  constructor(private store: Store<AppState>, public dialogRef: MatDialogRef<EditItemComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.listId = data.listId;
    this.itemId = data.itemId;
  }

  ngOnInit(): void {
    this.item$ = this.store.pipe(
      select(selectItem(this.itemId))
    );

    this.itemSub = this.item$.subscribe(item => {
      if (item) {
        this.name.setValue(item.name);
        this.quantity.setValue(item.quantity);
        this.price.setValue(item.price);
      }
    });
  }

  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 200);
  }

  updateItem(): void {
    this.store.dispatch(updateItem({
      listId: this.listId,
      itemId: this.itemId,
      name: this.name.value,
      quantity: this.quantity.value,
      price: this.price.value
    }));

    this.dialogRef.close();
  }

}

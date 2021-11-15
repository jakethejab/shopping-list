import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '@store/reducers';
import { createList, updateList } from '@store/actions';
import { selectList, selectListIsCreateLoading } from '@store/selectors/lists.selectors';
import { List } from '@core/models';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nameInput', { static: false }) nameInput: ElementRef;
  listSub: Subscription;
  loadingSub: Subscription;
  isCreate: boolean;
  isLoading = false;
  listId: string;
  title: string;
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  get name() {
    return this.formGroup.get('name');
  }
  
  constructor(private store: Store<AppState>, public dialogRef: MatDialogRef<ListFormComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.isCreate = data.isCreate;
    if (!this.isCreate) {
      this.listId = data.listId;
    }

    this.title = `${this.isCreate ? 'Add' : 'Edit'} List`;
  }

  ngOnInit(): void {
    if (this.isCreate) {
      this.loadingSub = this.store.pipe(
        select(selectListIsCreateLoading()),
        skip(1)
      ).subscribe(loading => {
        this.isLoading = loading;
        if (!loading) {
          this.dialogRef.close();
        }
      });
    }
    else {
      this.listSub = this.store.pipe(
        select(selectList(this.listId))
      ).subscribe(list => {
        this.name.setValue(list.name);
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.listSub) {
      this.listSub.unsubscribe();
    }

    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

  saveList(): void {
    if (this.isCreate) {
      this.store.dispatch(createList({ name: this.name.value }));
    } else {
      this.store.dispatch(updateList({ listId: this.listId, name: this.name.value }));

      this.dialogRef.close();
    }
  }  
}

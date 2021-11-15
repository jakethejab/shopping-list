import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { List } from '@core/models';
import { Store } from '@ngrx/store';
import { ListFormComponent } from '@shared/components/list-form/list-form.component';
import { AppState } from '@store/reducers';
import { deleteList } from '@store/actions';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListCardComponent implements OnInit {
  @Input() list: List;

  constructor(private router: Router, private dialog: MatDialog, private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  onClick(listId: string): void {
    this.router.navigate(['/lists', listId]);
  }

  onMenuClick(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  showListForm(listId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.width = '440px';
    dialogConfig.data = { isCreate: false, listId };
    dialogConfig.autoFocus = false;
    
    const dialogRef = this.dialog.open(ListFormComponent, dialogConfig);
  }

  deleteList(listId: string, name: string): void {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.store.dispatch(deleteList({ listId }));
    }
  }

}

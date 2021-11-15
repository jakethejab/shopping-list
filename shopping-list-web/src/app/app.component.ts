import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ListFormComponent } from '@shared/components/list-form/list-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'shopping-list-web';

  constructor(private dialog: MatDialog) {
  }

  showListForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'dialog-container';
    dialogConfig.width = '440px';
    dialogConfig.data = { isCreate: true };
    dialogConfig.autoFocus = false;
    
    const dialogRef = this.dialog.open(ListFormComponent, dialogConfig);
  }
}

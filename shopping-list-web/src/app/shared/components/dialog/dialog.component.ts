import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {
  @Input() title: string;
  @Input() settings: {
    dialogActions: boolean;
  };

  constructor() { }

  ngOnInit(): void {
  }

}

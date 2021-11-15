import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ButtonComponent } from './components/button/button.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ListFormComponent } from './components/list-form/list-form.component';

const angularMaterial = [
  MatToolbarModule,
  MatCardModule,
  MatRippleModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  FlexLayoutModule,
  MatTooltipModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDialogModule
];

const custom = [
  DialogComponent,
  ButtonComponent,
  ListFormComponent
];

const thirdParty = [
  NgxSkeletonLoaderModule
];

@NgModule({
  declarations: [
    ...custom
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...angularMaterial,
    ...thirdParty
  ],
  exports: [
    ...angularMaterial,
    ...custom,
    ...thirdParty
  ],
  entryComponents: [ListFormComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ListCardComponent } from './components/list-card/list-card.component';
import { ListsComponent } from './pages/lists/lists.component';
import { ListComponent } from './pages/list/list.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { EditItemComponent } from './components/edit-item/edit-item.component';

export const routes: Routes = [
  {
    path: '',
    component: ListsComponent
  },
  {
    path: ':listId',
    component: ListComponent
  }
];

@NgModule({
  declarations: [
    ListsComponent,
    ListComponent,
    ListCardComponent,
    AddItemComponent,
    EditItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [EditItemComponent]
})
export class ListsModule { }
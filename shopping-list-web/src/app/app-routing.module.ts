import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  {
    path: 'lists',
    loadChildren: () => import('./modules/lists/lists.module').then(m => m.ListsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

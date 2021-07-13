import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaintPage } from './paint.page';

const routes: Routes = [
  {
    path: '',
    component: PaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaintPageRoutingModule {}

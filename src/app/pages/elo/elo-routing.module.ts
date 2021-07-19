import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EloPage } from './elo.page';

const routes: Routes = [
  {
    path: '',
    component: EloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EloPageRoutingModule {}

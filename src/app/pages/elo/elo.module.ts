import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EloPageRoutingModule } from './elo-routing.module';

import { EloPage } from './elo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EloPageRoutingModule
  ],
  declarations: [EloPage]
})
export class EloPageModule {}

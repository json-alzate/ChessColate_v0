import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaintPageRoutingModule } from './paint-routing.module';

import { PaintPage } from './paint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaintPageRoutingModule
  ],
  declarations: [PaintPage]
})
export class PaintPageModule {}

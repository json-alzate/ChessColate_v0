import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import * as fromComponents from './components/';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    ...fromComponents.COMPONENTS
  ],
  entryComponents: [
    ...fromComponents.ENTRY_COMPONENTS
  ]
})
export class HomePageModule { }

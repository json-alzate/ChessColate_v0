import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import * as fromComponents from './components/';
import * as fromContainers from './containers/';

import * as fromPipes from './pipes';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    ...fromComponents.COMPONENTS,
    ...fromContainers.CONTAINERS,
    ...fromPipes.PIPES
  ],
  exports: [
    ...fromComponents.COMPONENTS,
    ...fromContainers.CONTAINERS,
    ...fromPipes.PIPES
  ],
  entryComponents: [
    ...fromComponents.ENTRY_COMPONENTS,
    ...fromContainers.ENTRY_CONTAINERS
  ]
})
export class SharedModule { }
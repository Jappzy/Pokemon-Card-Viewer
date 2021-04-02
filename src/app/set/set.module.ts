import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetPageRoutingModule } from './set-routing.module';

import { SetPage } from './set.page';
import { FilterModalModule } from '../filter-modal/filter-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetPageRoutingModule,
    FilterModalModule
  ],
  declarations: [SetPage]
})
export class SetPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { NaptarRoutingModule } from './naptar-routing.module';
import { NaptarComponent } from './naptar.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    NaptarRoutingModule,
    MatDatepickerModule
  ]
})
export class NaptarModule { }

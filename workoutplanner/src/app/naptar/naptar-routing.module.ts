import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaptarComponent } from './naptar.component';

const routes: Routes = [
  { path: '', component: NaptarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaptarRoutingModule { }

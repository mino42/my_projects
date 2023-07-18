import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BejelentkezesComponent } from './bejelentkezes.component';

const routes: Routes = [{ path: '', component: BejelentkezesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BejelentkezesRoutingModule { }

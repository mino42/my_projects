import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './szervizek/auth.guard';
import { Auth } from '@angular/fire/auth/auth';

const routes: Routes = [
  { path: 'edzes', loadChildren: ()=> import("./sulyzos/sulyzos.module").then(m=>m.SulyzosModule),canActivate:[AuthGuard]},
  { path: 'naptar', loadChildren: ()=> import("./naptar/naptar.module").then(m=>m.NaptarModule),canActivate:[AuthGuard]},
  { path: 'bejelentkezes', loadChildren: () => import('./bejelentkezes/bejelentkezes.module').then(m => m.BejelentkezesModule) },
  { path: 'regisztracio', loadChildren: () => import('./regisztracio/regisztracio.module').then(m => m.RegisztracioModule) },
  { path: 'felhasznalok', loadChildren: () => import('./about/about.module').then(m => m.AboutModule),canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

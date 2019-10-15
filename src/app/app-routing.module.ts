import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartPageComponent} from './start-page/start-page.component';
import {ConfComponent} from './conf/conf.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

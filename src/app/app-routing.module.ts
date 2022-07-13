import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  {path: 'chart', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule)},
  { path: 'collections', loadChildren: () => import('./modules/collections/collections.module').then(m => m.CollectionsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

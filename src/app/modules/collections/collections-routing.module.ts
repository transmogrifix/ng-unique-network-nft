import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CollectionsComponent} from "./collections.component";
import {CreateCollectionComponent} from "./create-collection/create-collection.component";
import {MintNftComponent} from "./mint-nft/mint-nft.component";
import {AllCollectionsComponent} from "./all-collections/all-collections.component";
import {GetCollectionByIdResolver} from "./resolvers/get-collection-by-id.resolver";

const routes: Routes = [{
  path: '',
  component: CollectionsComponent,
  children: [
    { path: '', component: AllCollectionsComponent },
    { path: 'create', component: CreateCollectionComponent },
    { path: ':id/edit', component: CreateCollectionComponent, resolve: { nftCollection: GetCollectionByIdResolver } },
    { path: ':id/mint', component: MintNftComponent, resolve: { nftCollection: GetCollectionByIdResolver } },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }

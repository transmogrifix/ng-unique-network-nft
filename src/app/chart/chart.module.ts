import {NgModule} from "@angular/core";
import {ChartComponent} from "./chart.component";
import {RouterModule} from "@angular/router";
import {NftDetailsComponent} from "./nft-details/nft-details.component";
import {ButtonComponent} from "../core/components/button/button.component";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {CollectionsComponent} from './collections/collections.component';
import {GetInitialsPipe} from "../core/pipes/get-initials.pipe";

@NgModule({
	declarations: [ChartComponent, NftDetailsComponent, CollectionsComponent],
	imports: [
		RouterModule.forChild([{path: '', component: ChartComponent}]),
		ButtonComponent,
		CommonModule,
		MatTabsModule,
		GetInitialsPipe
	],
	exports: [RouterModule]
})
export class ChartModule {
}

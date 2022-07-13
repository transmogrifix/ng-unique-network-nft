import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CollectionsRoutingModule} from './collections-routing.module';
import {CollectionsComponent} from './collections.component';
import {CreateCollectionComponent} from './create-collection/create-collection.component';
import {InputComponent} from "../../core/components/form-controls/input/input.component";
import {TextareaComponent} from "../../core/components/form-controls/textarea/textarea.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatOptionModule} from "@angular/material/core";
import {SelectComponent} from "../../core/components/form-controls/select/select.component";
import {ButtonComponent} from "../../core/components/button/button.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AddPropertyDialogComponent} from './create-collection/add-property-dialog/add-property-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MintNftComponent} from './mint-nft/mint-nft.component';
import {AllCollectionsComponent} from './all-collections/all-collections.component';
import {CollectionComponent} from './all-collections/collection/collection.component';
import {GetCollectionByIdResolver} from "./resolvers/get-collection-by-id.resolver";


@NgModule({
	declarations: [
		CollectionsComponent,
		CreateCollectionComponent,
		AddPropertyDialogComponent,
		MintNftComponent,
		AllCollectionsComponent,
		CollectionComponent,
	],
	imports: [
		CommonModule,
		CollectionsRoutingModule,
		InputComponent,
		TextareaComponent,
		SelectComponent,
		ButtonComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatOptionModule,
		MatCheckboxModule,
		MatTooltipModule,
		MatDialogModule
	],
	providers: [GetCollectionByIdResolver]
})
export class CollectionsModule {
}

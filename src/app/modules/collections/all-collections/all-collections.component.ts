import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {NFTCollection} from "../../../core/model/nft-collection";
import {CollectionCacheService} from "../../../core/services/collection-cache.service";

@Component({
	selector: 'app-all-collections',
	templateUrl: './all-collections.component.html',
	styleUrls: ['./all-collections.component.scss']
})
export class AllCollectionsComponent {
	public allNftCollections$: Observable<NFTCollection[]> = this.collectionCacheService.getAllCollection();

	constructor(
		private collectionCacheService: CollectionCacheService
	) {
	}
}

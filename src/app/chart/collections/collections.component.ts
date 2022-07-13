import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nft } from "../../core/model/nft";
import { FirebaseService } from "../../core/services/firebase.service";
import { CollectionCacheService } from "../../core/services/collection-cache.service";
import { NFTCacheService } from '../../core/services/nft-cache.service';
import { filter, map, Observable, of, tap } from 'rxjs';
import { NFTCollection } from '../../core/model/nft-collection';
import { NFTService } from '../../core/services/nft.service';

const Collection1Nft: Nft[] = [
	new Nft('Terra Core', 'TerraCore description', 'imageurl', 12345, 1, 'Pera', []),
	new Nft('Terra Core', 'TerraCore description', 'imageurl', 12345, 1, 'Pera', []),
	new Nft('Terra Core', 'TerraCore description', 'imageurl', 12345, 1, 'Pera', []),
	new Nft('Terra Core', 'TerraCore description', 'imageurl', 12345, 1, 'Pera', []),
];

@Component({
	selector: 'app-new-collections',
	templateUrl: './collections.component.html',
	styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent {
	@Input() isOpened: boolean = false;
	@Output() selectedNewNft: EventEmitter<Nft> = new EventEmitter<Nft>();
	@Output() attachToClicked: EventEmitter<Nft> = new EventEmitter<Nft>();
	public selectedNft: Nft | null = null;
	@Input('selectedNft') set setSelectedNft(value: Nft) {
		this.selectedNft = value;
		//if (value != null)
			//this.onTabChange(0);
	}
	public allCollections$ = this.collectionCacheService.getAllCollection()
		.pipe(
			tap(values => {
				this.indexToCollection.clear();
				for (var i = 0; i < values.length; i++) {
					this.indexToCollection.set(i, values[i]);
				}
			})
		);

	private indexToCollection = new Map<number, NFTCollection>();

	public collectionNfts$: Observable<Nft[]> = of([]);

	constructor(
		private firebaseService: FirebaseService,
		private collectionCacheService: CollectionCacheService,
		private nftCacheService: NFTCacheService,
		private nftService: NFTService
	) { }


	public onTabChange(num) {
		this.setCollection(this.indexToCollection.get(num).id);
	}

	private setCollection(collectionId: number) {
		this.collectionNfts$ = this.nftCacheService.allNfts$.pipe(
			map(nfts => nfts.filter(e => e.CollectionId === collectionId))
		)
	}

	@Input('attaching') set setAttaching(value: Nft) {
		
	}

	public onAttachToClicked(event, nft: Nft) {
		if (!this.selectedNft)
			return;

		this.attachToClicked.emit(nft);

		event.stopPropagation();
		event.preventDefault();
	}
}

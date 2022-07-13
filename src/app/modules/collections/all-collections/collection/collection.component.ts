import {Component, Input} from '@angular/core';
import {NFTCollection} from "../../../../core/model/nft-collection";
import {Router} from "@angular/router";
import {FirebaseService} from "../../../../core/services/firebase.service";
import {Nft} from "../../../../core/model/nft";
import {Observable, of} from "rxjs";

@Component({
	selector: 'app-collection',
	templateUrl: './collection.component.html',
	styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {
	public nftCollection: NFTCollection | null = null;
	public collectionNfts$: Observable<Nft[]> = of([]);
	public emptyCollectionArray = new Array(5);

	@Input('collection') set setCollection(collection: NFTCollection | null) {
		if(collection !== null) {
			this.nftCollection = collection;
			this.collectionNfts$ = this.firebaseService.getAllTokensFromCollection(collection.id);
		}
	}

	constructor(
		private router: Router,
		private firebaseService: FirebaseService
	) {
	}

	public redirectToCollection(): void {
		this.router.navigateByUrl(`/collections/${this.nftCollection.id}/edit`);
	}

	public redirectToMint(): void {
		this.router.navigateByUrl(`/collections/${this.nftCollection.id}/mint`);
	}

}

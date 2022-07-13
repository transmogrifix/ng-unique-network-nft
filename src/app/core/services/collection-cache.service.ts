import {Injectable, OnDestroy} from "@angular/core";
import {FirebaseService} from "./firebase.service";
import {BehaviorSubject, map, Observable, of, Subscription, switchMap} from "rxjs";
import {NFTCollection} from "../model/nft-collection";
import {AccountService, SelectedAccount} from "./account.service";

@Injectable({
	providedIn: 'root'
})
export class CollectionCacheService implements OnDestroy {
	private allCollectionsSubject: BehaviorSubject<NFTCollection[]> = new BehaviorSubject([]);
	public allCollections$: Observable<NFTCollection[]> = this.allCollectionsSubject.asObservable();

	private readonly collectionSubscription: Subscription | null = null;

	constructor(
		private firebaseService: FirebaseService,
		private accountService: AccountService
	) {
		this.collectionSubscription = this.accountService.selectedAccount$.pipe(
			switchMap((selectedAccount: SelectedAccount) => {
					return selectedAccount !== null ?
						this.firebaseService.getByOwnerAddressCollectionsSubscription(selectedAccount.account.address) :
						of([]);
				}
			))
			.subscribe((allCollections) => {
				this.allCollectionsSubject.next(allCollections);
			})
	}

	public getAllCollection(): Observable<NFTCollection[]> {
		return this.allCollections$;
	}

	public getCollectionById(collectionId: number): Observable<NFTCollection> {
		return this.allCollections$.pipe(
			map((collections) => collections.find((collection) => collection.id === collectionId))
		)
	}

	ngOnDestroy(): void {
		if (this.collectionSubscription) this.collectionSubscription.unsubscribe();
	}

}

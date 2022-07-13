import { Injectable, OnDestroy } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { BehaviorSubject, map, Observable, of, Subscription, switchMap } from "rxjs";
import { Nft } from "../model/nft";
import { AccountService, SelectedAccount } from "./account.service";

@Injectable({
	providedIn: 'root'
})
export class NFTCacheService implements OnDestroy {
	private allNfts: BehaviorSubject<Nft[]> = new BehaviorSubject([]);
	public allNfts$: Observable<Nft[]> = this.allNfts.asObservable();

	private readonly nftSubscription: Subscription | null = null;

	constructor(
		private firebaseService: FirebaseService,
		private accountService: AccountService
	) {
		this.nftSubscription = this.accountService.selectedAccount$.pipe(
			switchMap((selectedAccount: SelectedAccount) => {
				return selectedAccount !== null ?
					this.firebaseService.getAllTokensByOwnerAddressObservable(selectedAccount.account.address) :
					of([]);
			}
			))
			.subscribe((allNfts) => {
				this.allNfts.next(allNfts);
			})
	}

	public getAllNfts(): Observable<Nft[]> {
		return this.allNfts$;
	}


	public getNftById(nftId: number): Observable<Nft> {
		return this.allNfts$.pipe(
			map((nfts) => nfts.find((nft) => nft.TokenId === nftId))
		)
	}

	public getById(collectionId: number, tokenId: number) {
		return this.allNfts.value.find(n => n.CollectionId == collectionId && n.TokenId == tokenId);
	}

	ngOnDestroy(): void {
		if (this.nftSubscription) this.nftSubscription.unsubscribe();
	}

}

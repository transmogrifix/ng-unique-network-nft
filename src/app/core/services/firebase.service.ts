import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {INFTCollection, NFTCollection} from "../model/nft-collection";
import {map, Observable} from "rxjs";
import {INft, Nft} from '../model/nft';


@Injectable({
	providedIn: 'root'
})
export class FirebaseService {
	private collectionName: string = 'collections';
	private tokenName: string = 'tokens';

	constructor(private store: AngularFirestore) {
	}

	public addCollection(nftCollection: NFTCollection): Promise<void> {
		return this.store.collection(this.collectionName).doc(nftCollection.id.toString()).set(nftCollection.toObject());
	}

	public updateCollection(id: number, nftCollection: NFTCollection): Promise<void> {
		return this.store.collection(this.collectionName).doc(id.toString()).update(nftCollection.toObject());
	}

	public getCollectionById(id: number): Observable<NFTCollection> {
		return this.store.collection<INFTCollection>(this.collectionName).doc(id.toString()).get()
			.pipe(
				map(querySnapshot => NFTCollection.from(querySnapshot.data()))
			);
	}

	public getByOwnerAddressCollectionsSubscription(ownerAddress: string): Observable<NFTCollection[]> {
		return this.store.collection<INFTCollection>(this.collectionName, (q) => q.where('normalizedOwner', '==', ownerAddress)).valueChanges().pipe(
			map((collections) => collections.map((collection) => NFTCollection.from(collection)))
		);
	}

	public getByOwnerAddressCollections(ownerAddress: string): Observable<NFTCollection[]> {
		return this.store.collection<INFTCollection>(this.collectionName, (q) => q.where('normalizedOwner', '==', ownerAddress)).get()
			.pipe(
				map((querySnapshot) => querySnapshot.docs.map((doc) => NFTCollection.from(doc.data())))
			);
	}

	public getAllCollections(): Observable<NFTCollection[]> {
		return this.store.collection<INFTCollection>(this.collectionName).get()
			.pipe(
				map((querySnapshot) => querySnapshot.docs.map((doc) => NFTCollection.from(doc.data())))
			);
	}

	public deleteCollection(id: number): Promise<void> {
		return this.store.collection(this.collectionName).doc(id.toString()).delete();
	}

	public addToken(token: Nft): Promise<void> {
		return this.store.collection(this.tokenName).doc(`${token.CollectionId}-${token.TokenId}`).set(token.toObject());
	}

	public updateToken(token: Nft): Promise<void> {
		return this.store.collection(this.tokenName).doc(`${token.CollectionId}-${token.TokenId}`).update(token.toObject());
	}

	public deleteToken(id: number): Promise<void> {
		return this.store.collection(this.tokenName).doc(id.toString()).delete();
	}

	public getTokenById(collectionId: number, tokenId : number): Observable<Nft> {
		return this.store.collection<INft>(this.tokenName).doc(`${collectionId}-${tokenId}`).get()
			.pipe(
				map(querySnapshot => querySnapshot.data()),
				map(token => Nft.from(token as INft))
			);
	}

	public getAllTokensFromCollection(collectionId: number): Observable<Nft[]> {
		return this.store.collection<INft>(this.tokenName, (q) => q.where('CollectionId', '==', collectionId)).get()
			.pipe(
				map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data())),
				map((tokens) => tokens.map(e => Nft.from(e)))
			);
	}

	public getAllTokens(): Observable<Nft[]> {
		return this.store.collection<INft>(this.tokenName).get()
			.pipe(
				map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data())),
				map((tokens) => tokens.map(e => Nft.from(e)))
			);
	}

	public getAllTokensFromCollectionObservable(collectionId: number): Observable<Nft[]> {
		return this.store.collection<INft>(this.tokenName, (q) => q.where('CollectionId', '==', collectionId)).valueChanges()
			.pipe(
				map((tokens) => tokens.map(e => Nft.from(e)))
			);
	}


	public getAllTokensByOwnerAddressObservable(ownerAddress: string): Observable<Nft[]> {
		return this.store.collection<INft>(this.tokenName, (q) => q.where('Owner', '==', ownerAddress)).valueChanges().pipe(
			map((nfts) => nfts.map((nft) => Nft.from(nft)))
		);
	}
}

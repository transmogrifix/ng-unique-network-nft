import {Injectable} from "@angular/core";
import {CollectionPermissions, CollectionTokenPropertyPermission, NFTCollection} from "../model/nft-collection";
import {AccountService} from "./account.service";
import {FirebaseService} from "./firebase.service";
import {NodeService} from "./node.service";
import {UniqueUtil} from "./unique-helper";


export class CreateCollectionOptions {

	public permissions: CollectionPermissions;
	public tokenPropertyPermissions: CollectionTokenPropertyPermission[];

	constructor(public name: string, public description: string, public tokenPrefix: string, permissions: CollectionPermissions = new CollectionPermissions(), tokenPropertyPermissions: CollectionTokenPropertyPermission[] = []) {
		this.permissions = permissions;
		this.tokenPropertyPermissions = tokenPropertyPermissions;
	}

	public toOptions(): any {
		return {
			name: UniqueUtil.str2vec(this.name),
			description: UniqueUtil.str2vec(this.description),
			tokenPrefix: UniqueUtil.str2vec(this.tokenPrefix),
			mode: {
				nft: null
			},
			permissions: this.permissions,
			tokenPropertyPermissions: this.tokenPropertyPermissions
		}
	}
}

@Injectable({
	providedIn: 'root'
})
export class NFTCollectionService {

	constructor(private nodeService: NodeService, private accountService: AccountService, private firebaseService: FirebaseService) {

	}


	public async getCollectionById(collectionId: number): Promise<NFTCollection> {

		let data = await this.nodeService.uniqueHelper.getCollection(collectionId);
		return new NFTCollection(data.id, data.name, data.description, data.tokensCount, data.admins, data.raw, data.normalizedOwner);
	}

	public async getCollectionCount(): Promise<number> {
		return await this.nodeService.uniqueHelper.getTotalCollectionsCount();
	}

	public async createCollection(options: CreateCollectionOptions, label: string = '', transactionLabel: string = 'api.tx.unique.createCollectionEx'): Promise<NFTCollection> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;

		let collectionOptions = options.toOptions();
		let collectionEx = api.tx.unique.createCollectionEx(collectionOptions);
		const creationResult = await account.signTransaction(this.nodeService.uniqueHelper, collectionEx, transactionLabel);

		let collection = await this.getCollectionById(UniqueUtil.extractCollectionIdFromCreationResult(creationResult, label));

		await this.firebaseService.addCollection(collection);
		return collection;
	}

	public async setProperties(collectionId: number, properties: any, label: string = 'set collection properties', transactionLabel: string = 'api.tx.unique.setCollectionProperties'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;
		const tx = api.tx.unique.setCollectionProperties(collectionId, properties);

		const result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		if (result.status !== UniqueUtil.transactionStatus.SUCCESS) {
			throw Error(`Unable to set collection properties for ${label}`);
		}

		return UniqueUtil.findCollectionInEvents(result.result.events, collectionId, 'common', 'CollectionPropertySet', label);
	}

	public async deleteProperties(collectionId: number, propertyKeys: string[], label: string = 'delete collection properties', transactionLabel: string = 'api.tx.unique.deleteCollectionProperties'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;
		const tx = api.tx.unique.deleteCollectionProperties(collectionId, propertyKeys);

		const result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		if (result.status !== UniqueUtil.transactionStatus.SUCCESS) {
			throw Error(`Unable to delete collection properties for ${label}`);
		}
		return UniqueUtil.findCollectionInEvents(result.result.events, collectionId, 'common', 'CollectionPropertyDeleted', label);
	}

	public async setTokenPropertyPermissions(collectionId: number, tokenPropertyPermissions: CollectionTokenPropertyPermission[], label: string = 'set token property permissions', transactionLabel: string = 'api.tx.unique.setPropertyPermissions'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;
		const tx = api.tx.unique.setTokenPropertyPermissions(collectionId, tokenPropertyPermissions);

		const result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		if (result.status !== UniqueUtil.transactionStatus.SUCCESS) {
			throw Error(`Unable to set collection properties for ${label}`);
		}

		return UniqueUtil.findCollectionInEvents(result.result.events, collectionId, 'common', 'PropertyPermissionSet', label);
	}

	public async setCollectionPermissions(collectionId: number, permissions: CollectionPermissions, label: string = 'set permissions', transactionLabel: string = 'api.tx.unique.setCollectionPermissions'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;
		const tx = api.tx.unique.setCollectionPermissions(collectionId, permissions);

		const result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		if (result.status !== UniqueUtil.transactionStatus.SUCCESS) {
			throw Error(`Unable to set collection permissions for ${label}`);
		}

		const res = UniqueUtil.findCollectionInEvents(result.result.events, collectionId, 'unique', 'CollectionPermissionSet', label);

		if(res) {
			const collection = await this.getCollectionById(collectionId);

			try {
				await this.firebaseService.updateCollection(collectionId, collection);
				return true;
			} catch (err: any) {
				console.log(err);
				return false;
			}
		} else {
			return false;
		}
	}
}

import { Injectable } from "@angular/core";
import { Nft, Property, TokenAndCollectionIds } from "../model/nft";
import { AccountService } from "./account.service";
import { FirebaseService } from "./firebase.service";
import { NodeService } from "./node.service";
import { UniqueUtil } from "./unique-helper";


@Injectable({
  providedIn: 'root'
})
export class NFTService {
	constructor(private nodeService: NodeService, private accountService: AccountService, private firebaseService: FirebaseService) {

	}

	public async getTokenById(collectionId: number, tokenId: number): Promise<Nft> {
		let tokenData = await this.nodeService.uniqueHelper.getToken(collectionId, tokenId, undefined, undefined);

		let name: string = '';
		let description: string = '';
		let props: Property[] = [];
		for (let prop of tokenData.properties) {
			switch (prop.key) {
				case 'name':
					name = prop.value;
					break;
				case 'description':
					description = prop.value;
					break;
				default: props.push(new Property(prop.key, prop.value));
			}
		}
		let result = new Nft(name, description, '', tokenId, collectionId, tokenData.normalizedOwner.substrate, props);

		return Promise.resolve(result);
	}

	public async mintToken(collectionId: number, owner: string, properties: any[], label: string = 'new token', transactionLabel: string = 'api.tx.unique.createItem'): Promise<Nft> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;

		const tx = api.tx.unique.createItem(collectionId, { Substrate: owner }, {
			nft: {
				properties
			}
		});

		const creationResult = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		const createdTokens = UniqueUtil.extractTokensFromCreationResult(creationResult, label);
		if (createdTokens.tokens.length > 1)
			return Promise.reject('Created multiple tokens');

		if (createdTokens.tokens.length == 0)
			return Promise.reject('Failed to create');

		let tokenId = createdTokens.tokens[0].tokenId;
		let token = await this.getTokenById(collectionId, tokenId);

		await this.firebaseService.addToken(token);
		return Promise.resolve(token);
	}

	public async transferToken(collectionId: number, tokenId: number, addressObj: any, transactionLabel = 'api.tx.unique.transfer'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;

		let tx = api.tx.unique.transfer(addressObj, collectionId, tokenId, 1);

		let result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		return UniqueUtil.isTokenTransferSuccess(result.result.events, collectionId, tokenId, { Substrate: account.account.address }, addressObj);
	}

	public async transferTokenFrom(collectionId: number, tokenId: number, fromAddressObj: any, toAddressObj: any, transactionLabel = 'api.tx.unique.transfer'): Promise<boolean> {
		if (!this.accountService.selectedAccount)
			return Promise.reject('No account selected');

		const account = this.accountService.selectedAccount;
		const api = this.nodeService.uniqueHelper.api;

		let tx = api.tx.unique.transferFrom(fromAddressObj, toAddressObj, collectionId, tokenId, 1);

		let result: any = await account.signTransaction(this.nodeService.uniqueHelper, tx, transactionLabel);
		return UniqueUtil.isTokenTransferSuccess(result.result.events, collectionId, tokenId, fromAddressObj, toAddressObj);
	}

	public async nestToken(token: Nft, rootToken: Nft, label: string = 'nest token', transactionLabel: string = 'api.tx.unique.transfer'): Promise<boolean> {
		const rootTokenAddress = { Ethereum: UniqueUtil.getNestingTokenAddress(rootToken.CollectionId, rootToken.TokenId) };
		const result: any = await this.transferToken(token.CollectionId, token.TokenId, rootTokenAddress, transactionLabel);
		if (!result) {
			throw Error(`Unable to nest token for ${label}`);
		}

		if (result) {
			token.ParentId = new TokenAndCollectionIds(rootToken.CollectionId, rootToken.TokenId);
			rootToken.Children.push(new TokenAndCollectionIds(token.CollectionId, token.TokenId));
			await this.firebaseService.updateToken(token)
			await this.firebaseService.updateToken(rootToken);
		}

		return result;
	}

	public async unnestToken(token: Nft, rootToken: Nft, toAddress: string, label: string = 'unnest token', transactionLabel: string = 'api.tx.unique.transferFrom'): Promise<boolean> {
		const rootTokenAddress = { Ethereum: UniqueUtil.getNestingTokenAddress(rootToken.CollectionId, rootToken.TokenId) };
		const result: any = await this.transferTokenFrom(token.CollectionId, token.TokenId, rootTokenAddress, { Substrate: toAddress }, transactionLabel);
		if (!result) {
			throw Error(`Unable to unnest token for ${label}`);
		}

		if (result) {
			token.ParentId.token = 0;
			token.ParentId.collection = 0;
			let idx = rootToken.Children.findIndex(e => e.token == token.TokenId && e.collection == token.CollectionId);
			if (idx > -1)
				rootToken.Children.splice(idx, 1);
			await this.firebaseService.updateToken(token)
			await this.firebaseService.updateToken(rootToken)
		}

		return result;
	}

	/*
	public async getTokenChildren(collectionId: number, token: Nft, label: string = 'get token children', transactionLabel: string = 'api.tx.unique.transferFrom'): Promise<any> {
		const tokenAddress = { Ethereum: UniqueUtil.getNestingTokenAddress(token.CollectionId, token.TokenId) };
		const api = this.nodeService.uniqueHelper.api;
		let res = await api.rpc.unique.accountTokens(token.CollectionId, tokenAddress);
		if (!res) {
			
		}
		return res.toJSON();
	}*/

	public async getTokenChildren(token: Nft): Promise<any> {
		const api = this.nodeService.uniqueHelper.api;
		let res = await api.rpc.unique.tokenChildren(token.CollectionId, token.TokenId);
		return res.toJSON();
	}

	public async getTopmostTokenOwner(token: Nft): Promise<any> {
		const api = this.nodeService.uniqueHelper.api;
		let res = await api.rpc.unique.topmostTokenOwner(token.CollectionId, token.TokenId);
		return res.toJSON();
	}
}

import { Injectable } from "@angular/core";
import { TreeNode } from "../core/model/tree-node";
import { FirebaseService } from "../core/services/firebase.service";
import { NFTCacheService } from "../core/services/nft-cache.service";


@Injectable({
	providedIn: 'root'
})
export class ChartTreeService {




	constructor(private firebaseService: FirebaseService, private nftCacheService: NFTCacheService) {

	}

	public async makeTree(collectionId: number, tokenId: number, level: number = 5): Promise<TreeNode> {

		let token = this.nftCacheService.getById(collectionId, tokenId);
		if (!token)
			return Promise.reject('Invalid token');

		let c = this.levelToColor(level);
		let res = new TreeNode('', token, level, [], c);
		for (let childToken of token.Children) {
			let child = await this.makeTree(childToken.collection, childToken.token, level - 1);
			res.children.push(child);
		}

		return res;
	}

	private levelToColor(level: number): string {
		switch (level) {
			case 5: return '#b812d2'
			case 4: return '#3bac37'
			case 3: return '#24bfe2'
			case 2: return '#3758ac'
			case 1: return '#d65a20'
		}
	}
}

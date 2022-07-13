import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {SvgIcons} from "./icons";
import {DomSanitizer} from "@angular/platform-browser";
import {NodeService} from './core/services/node.service';
import {AccountService} from './core/services/account.service';
import {NFTCollectionService} from './core/services/nft-collection.service';
import {NFTService} from './core/services/nft.service';
import { Nft } from './core/model/nft';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private nodeService: NodeService,
		private accountService: AccountService,
		private collectionService: NFTCollectionService,
		private nftService: NFTService
	) {
		this.registerIcons();

		this.connect();
	}

	ngOnInit(): void {
	}

	private async connect(): Promise<void> {
		let allAccounts = await this.accountService.initialize();

		//console.log('AllAccounts = ', allAccounts);
		await this.accountService.selectAccount(allAccounts[0]);

		await this.nodeService.connect();

		/*console.log('total collections = ', await this.collectionService.getCollectionCount());


		console.log('collection 80 = ', await this.collectionService.getCollectionById(80));
		console.log('collection 81 = ', await this.collectionService.getCollectionById(81));

		
		let acct = this.accountService.selectedAccount;

		let terraCore = await this.nftService.getTokenById(109, 1);
		console.log('terraCore = ', terraCore)

		let office = await this.nftService.getTokenById(110, 1);
		console.log('office = ', office)

		let svetozar = await this.nftService.getTokenById(111, 1);
		console.log('svetozar = ', svetozar)*/

		/*`let attachRes = await this.nftService.nestToken(office, terraCore);
		console.log('attachRes = ', attachRes);

		attachRes = await this.nftService.nestToken(svetozar, office);
		console.log('attachRes = ', attachRes);

		let z = await this.nftService.getTokenChildren(office);
		console.log('z = ', z);*/

		/*let z2 = await this.nftService.getTopmostTokenOwner(tok1);
		console.log('z2 = ', z2);*/

		/*let attachRes = await this.nftService.nestToken(tok1, tok2);
		console.log('attachRes = ', attachRes);*/

		/*let z = await this.nodeService.uniqueHelper.mintNFTCollection(acct.account, {
			name: 'Ttt1',
		})
		console.log('new z = ', z);*/

		/*let options = new CreateCollectionOptions("Terra 2", "Terra Desc 2", "TCT2");
		options.permissions.nesting.tokenOwner = true;
		options.tokenPropertyPermissions.push(CollectionTokenPropertyPermission.make('name', true, false, true))

		let newColl = await this.collectionService.createCollection(options);
		console.log('new collection = ', newColl);*/

		/*let nft = await this.nftService.mintToken(73, acct.account.address, [
			{ key: 'name', value: 'first nft token' }
		]);
		console.log(nft);*/


		/*
		// 2) Make a user from seed (use **your** seed here)
		const user = UniqueUtil.fromSeed('stool about amazing erode cotton popular cage half toss squeeze milk traffic');

		// 3) Collection create info
		let collectionInfo = {
			name: 'nesting-example',
			description: 'A collection to demonstrate simple token nesting',
			tokenPrefix: 'SMPL',

			// We need to enable nesting. It is disabled by default.
			permissions: {
				nesting: {
					tokenOwner: true
				}
			}
		};

		uniqueHelper.api.setSigner(injector.signer);

		// 4) Create new collection and mint a couple of tokens

		// `mintNFTCollection` takes care of all
		// the boilerplate regarding the collection creation.
		// It will take care of creating, signing and submitting the transaction.
		// Also, it will fetch the created collection object.
		//const collection = await uniqueHelper.mintNFTCollection(senderAddress, collectionInfo);
		//console.log('collection = ', collection);*/
	}

	private registerIcons() {
		for (let icon of SvgIcons) {
			this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.url));
		}
	}
}

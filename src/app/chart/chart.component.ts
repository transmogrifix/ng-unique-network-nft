import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import { Nft } from "../core/model/nft";
import { TreeNode } from "../core/model/tree-node";
import { ActivatedRoute } from '@angular/router';
import { ChartTreeService } from './chart-tree.service';
import { NFTService } from '../core/services/nft.service';
import { IComponentDataItem } from '@amcharts/amcharts5/.internal/core/render/Component';
import { NFTCacheService } from '../core/services/nft-cache.service';

export class Theme extends am5themes_Animated {
	public override setupDefaultRules() {
		this.rule("ForceDirected").states.create("yes", {
			fill: am5.color('#ffffff'),
			opacity: 0
		});
	}
}

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
	public openDetails = false;
	public selectedNft: Nft | null = null;
	public isNewNft: boolean = false;

	public root: TreeNode;

	
	private tokenId: number = 1;
	private collectionId: number = 110;

	constructor(
		@Inject(PLATFORM_ID) private platformId: any,
		private zone: NgZone,
		private cdf: ChangeDetectorRef,
		private route: ActivatedRoute,
		private chartTreeService: ChartTreeService,
		private nftService: NFTService,
		private nftCacheService: NFTCacheService
	) {

		if (route.snapshot.queryParamMap.has('tokenId') && route.snapshot.queryParamMap.has('collectionId')) {
			this.tokenId = Number(route.snapshot.queryParamMap.get('tokenId'));
			this.collectionId = Number(route.snapshot.queryParamMap.get('collectionId'));
		}


	}

	private series: am5hierarchy.ForceDirected;
	async ngAfterViewInit(): Promise<void> {
		setTimeout(async () => {
			this.root = await this.chartTreeService.makeTree(this.collectionId, this.tokenId);
			this.browserOnly(() => {
				let root = am5.Root.new("chartdiv");

				root.setThemes([
					Theme.new(root)
				]);

				let treeNode: TreeNode = new TreeNode('', new Nft(), 1, [this.root], '#d65a20');


				// Create wrapper container
				let container = root.container.children.push(am5.Container.new(root, {
					width: am5.percent(100),
					height: am5.percent(100),
					layout: root.verticalLayout
				}));

				// Create series
				let series = container.children.push(am5hierarchy.ForceDirected.new(root, {
					singleBranchOnly: true,
					downDepth: 1,
					topDepth: 1,
					initialDepth: 4,
					valueField: "value",
					categoryField: "name",
					childDataField: "children",
					//fillField: "color",
					idField: "name",
					linkWithField: "linkWith",
					manyBodyStrength: -5,
					centerStrength: 0.3,
					nodePadding: 15
				}));
				this.series = series

				/*series.get("colors")!.setAll({
					step: 1, 
					colors: [
						am5.color('#b812d2'),
						am5.color('#3bac37'),
						am5.color('#24bfe2'),
						am5.color('#3758ac'),
						am5.color('#d65a20'),
					],
				});*/

				series.links.template.set("strength", 0.5);

				series.circles.template.events.on('click', (event) => {

					if (event.target && event.target.dataItem && event.target.dataItem.dataContext) {
						//event.target.set("", am5.color("#ffffff"));
						//event.target.set("stroke", am5.color("#ffffff"));
						//event.target.set("strokeWidth", 5);
						/*event.target.set("fillPattern", am5.LinePattern.new(root, {
							color: am5.color('rgba(255, 255, 255, 0.2)'),
							rotation: 45,
							strokeWidth: 0.5
						}))*/
						const clickedTree = event.target.dataItem.dataContext as TreeNode;


						this.setSelectedNft(clickedTree.nft);
						this.bla = event.target.dataItem;

						// if(this.selectedNft === clickedTree.nft) {
						//   this.selectedNft = null;
						//   this.setNftDetails(null);
						// } else {
						//   this.selectedNft = clickedTree.nft;
						//   this.setNftDetails(clickedTree.nft);
						// }
					}
				});

				series.data.setAll([treeNode]);

				series.set("selectedDataItem", series.dataItems[0]);

				// Make stuff animate on load
				series.appear(1000, 100);
			})

		}, 1000)
		
	}

	// Run the function only in the browser
	browserOnly(f: () => void) {
		if (isPlatformBrowser(this.platformId)) {
			this.zone.runOutsideAngular(() => {
				f();
			});
		}
	}

	private bla: am5.DataItem<IComponentDataItem>; 
	public setSelectedNft(nft: Nft | null, isNew: boolean = false) {
		this.isNewNft = isNew;

		if (this.selectedNft === nft) {
			this.selectedNft = null;
			this.openDetails = false;
		} else {
			this.selectedNft = nft;
			this.openDetails = true;
		}

		this.cdf.detectChanges();
	}

	// public setNftDetails(nft: Nft | null): void {
	//   this.openDetails = !!nft;
	//   this.cdf.detectChanges();
	// }

	public closeNftDetails(): void {
		this.selectedNft = null;
		this.openDetails = false;

		this.cdf.detectChanges();
	}


	public attaching: Nft = null;
	public async onAttachToClicked(nft: Nft): Promise<void> {
		this.attaching = nft;
		try {
			let res = await this.nftService.nestToken(nft, this.selectedNft);
			console.log('nest result = ', res);

			let selNode = this.root.findNode((n) => n.nft.CollectionId == this.selectedNft.CollectionId && n.nft.TokenId == this.selectedNft.TokenId);
			if (selNode != null) {
				let tn = new TreeNode('', nft, selNode.value - 1, []);
				selNode.children = [...selNode.children, tn];
				let treeNode: TreeNode = new TreeNode('', new Nft(), 1, [this.root], '#d65a20');
				this.series.data.setAll([treeNode]);
				this.series.set("selectedDataItem", this.series.dataItems[0]);
			}
		}
		finally {
			this.attaching = null;
		}
	}

	public detaching: boolean = false;
	public async onDetachClicked(nft: Nft): Promise<void> {
		this.detaching = true;
		try {
			let parentToken = await this.nftCacheService.getById(this.selectedNft.ParentId.collection, this.selectedNft.ParentId.token);
			let res = await this.nftService.unnestToken(this.selectedNft, parentToken, parentToken.Owner);
			console.log('detach res = ', res);


			let parentNode = this.root.findNode((n) => n.nft.CollectionId == parentToken.CollectionId && n.nft.TokenId == parentToken.TokenId);
			if (parentNode != null) {
				let idx = parentNode.children.findIndex(e => e.nft.CollectionId == nft.CollectionId && e.nft.TokenId == nft.TokenId);
				if (idx > -1) {
					parentNode.children.splice(idx, 1);
					let treeNode: TreeNode = new TreeNode('', new Nft(), 1, [this.root], '#d65a20');
					this.series.data.setAll([treeNode]);
					this.series.set("selectedDataItem", this.series.dataItems[0]);
				}
			}
		} finally {
			this.detaching = false;
		}
	}

			

}

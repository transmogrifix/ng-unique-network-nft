import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ButtonLoadingState } from '../../core/components/button/button.component';
import {Nft} from "../../core/model/nft";
import { NFTCacheService } from '../../core/services/nft-cache.service';
import { NFTService } from '../../core/services/nft.service';

@Component({
  selector: 'app-nft-details',
  templateUrl: './nft-details.component.html',
  styleUrls: ['./nft-details.component.scss']
})
export class NftDetailsComponent implements OnInit {
  @Input() selectedNft: Nft | null = null;
  @Input() isNew: boolean = false;
	@Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() detachClicked: EventEmitter<Nft> = new EventEmitter<Nft>();

	public buttonLoadingState = new ButtonLoadingState();

	@Input('working') set setWorking(value: boolean) {
		this.buttonLoadingState.updateState(value);
	}

	
	constructor(private nftService: NFTService, private nftCacheService: NFTCacheService) { }

  ngOnInit(): void {
  }


	public async detachFromParentClicked(): Promise<void> {
		if (this.selectedNft.ParentId.token === 0)
			return;

		console.log('a')
		this.detachClicked.emit(this.selectedNft);
		console.log('b')
	}
}

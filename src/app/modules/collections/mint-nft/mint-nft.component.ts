import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NFTCollection} from "../../../core/model/nft-collection";
import {NFTService} from "../../../core/services/nft.service";
import {ButtonLoadingState} from "../../../core/components/button/button.component";
import {FirebaseService} from "../../../core/services/firebase.service";
import {SnackbarService} from "../../../core/components/snackbar/snackbar.service";

@Component({
	selector: 'app-mint-nft',
	templateUrl: './mint-nft.component.html',
	styleUrls: ['./mint-nft.component.scss']
})
export class MintNftComponent implements OnInit {
	public nftCollection: NFTCollection = this.activatedRoute.snapshot.data['nftCollection'] as NFTCollection;
	public selectedImageData: string = '';

	public formGroupControls = {
		name: new FormControl<string>('', Validators.required),
		description: new FormControl<string>('', Validators.required),
		image: new FormControl<string>(''),
		count: new FormControl<number | null>(null),
	}
	public formGroup = new FormGroup(this.formGroupControls);
	public buttonLoadingState = new ButtonLoadingState();

	public get canSubmit(): boolean {
		return this.formGroup.valid && !this.buttonLoadingState.isDisabled;
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private nftService: NFTService,
		private firebaseService: FirebaseService,
		private snackbarService: SnackbarService,
		private router: Router
	) {
		// Add new controls to the form group
		this.nftCollection.tokenPropertyPermissions.forEach((property) => {
			if (property.key.toLowerCase() !== 'name' && property.key.toLowerCase() !== 'description') {
				// @ts-ignore
				this.formGroup.addControl(property.key, new FormControl(''));
			}
		})
	}

	ngOnInit(): void {
	}

	public onSelectedImage(event: Event): void {
		const file = (event.target as HTMLInputElement).files[0];
		const reader = new FileReader();

		if(file.size > 200000) return;

		reader.onload = () => {
			this.selectedImageData = reader.result as string;
		}

		reader.readAsDataURL(file);
	}

	public async onSubmit(): Promise<any> {
		const properties: any[] = [];

		this.buttonLoadingState.updateState(true);

		for (let key in this.formGroup.value) {
			if (key == 'count' || key == 'image')
				continue;

			const property = {
				key: key,
				value: this.formGroup.value[key]
			}

			properties.push(property);
		}

		try {
			const mintedNft = await this.nftService.mintToken(this.nftCollection.id, this.nftCollection.normalizedOwner, properties);

			if(this.selectedImageData !== '') {
				mintedNft.ImageData = this.selectedImageData;

				try {
					await this.firebaseService.updateToken(mintedNft);
					await this.router.navigateByUrl('/collections');
				} catch (err: any) {
					console.log(err);
				}
			}

			this.buttonLoadingState.updateState(false);
			this.snackbarService.show('Nft has been successfully created');
		} catch (err: any) {
			console.log('err', err);
			this.buttonLoadingState.updateState(false);
		}
	}

}

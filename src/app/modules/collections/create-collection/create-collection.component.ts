import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AddPropertyDialogComponent} from "./add-property-dialog/add-property-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateCollectionOptions, NFTCollectionService} from '../../../core/services/nft-collection.service';
import {CollectionTokenPropertyPermission, NFTCollection} from '../../../core/model/nft-collection';
import {ButtonLoadingState} from "../../../core/components/button/button.component";
import {FirebaseService} from "../../../core/services/firebase.service";
import {SnackbarService} from "../../../core/components/snackbar/snackbar.service";
import {CollectionCacheService} from "../../../core/services/collection-cache.service";

@Component({
	selector: 'app-create-collection',
	templateUrl: './create-collection.component.html',
	styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent implements OnInit {
	public allNftCollections: NFTCollection[] = [];
	public collection = this.activatedRoute.snapshot.data['nftCollection'] as NFTCollection;
	public isEdit = false;
	public selectedImageData: string = '';
	public updatedImage: boolean = false;

	public formGroupControls = {
		name: new FormControl<string>('', Validators.required),
		description: new FormControl<string>('', Validators.required),
		attachTo: new FormControl<number[]>([]),
	}

	public formGroup = new FormGroup(this.formGroupControls);
	public buttonLoadingState = new ButtonLoadingState();

	public props: CollectionTokenPropertyPermission[] = [];

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private collectionService: NFTCollectionService,
		private activatedRoute: ActivatedRoute,
		private firebaseService: FirebaseService,
		private snackbarService: SnackbarService,
		private collectionCacheService: CollectionCacheService
	) {
		this.collectionCacheService.getAllCollection().subscribe((collections) => {
			if (this.collection) {
				this.allNftCollections = collections.filter((c) => c.id !== this.collection.id);
			} else {
				this.allNftCollections = collections;
			}
		})
	}

	ngOnInit(): void {
		if (this.activatedRoute.snapshot.paramMap.has('id')) {
			this.isEdit = true;
			this.initCollectionForm();
		} else {
			this.isEdit = false;
		}
	}

	public openAddPropertyDialog() {
		this.dialog.open(AddPropertyDialogComponent, {panelClass: 'add-property', autoFocus: false})
			.afterClosed()
			.subscribe(value => {
				if (!value)
					return;

				this.props.push(value);
			});
	}

	public async onSubmit(): Promise<void> {
		this.buttonLoadingState.updateState(true);

		if (this.isEdit) {
			// When attach to has been changed
			if(this.formGroupControls.attachTo.value.length > 0) {
			// Update collection permissions
			//this.collection.permissions.access = "AllowList";
			this.collection.permissions.nesting.restricted = this.formGroupControls.attachTo.value;
			this.collection.permissions.mintMode = false;
			this.collection.permissions.nesting.tokenOwner = true;
			this.collection.permissions.nesting.collectionAdmin = false;

				try {
					const result = await this.collectionService.setCollectionPermissions(this.collection.id, this.collection.permissions);
				} catch (err: any) {
					console.log(err);
					this.buttonLoadingState.updateState(false);
				}
			}

			// When collection image has been changed
			if(this.selectedImageData !== '' && this.updatedImage === true) {
				this.collection.imageData = this.selectedImageData;
				await this.firebaseService.updateCollection(this.collection.id, this.collection);
			}

			this.buttonLoadingState.updateState(false);
			this.snackbarService.show('Collection has been successfully updated');
			this.redirectToCollections();
		} else {
			let options = new CreateCollectionOptions(this.formGroupControls.name.value, this.formGroupControls.description.value, "TCT2");
			options.permissions.nesting.tokenOwner = true;
			options.permissions.nesting.collectionAdmin = true;
			options.permissions.nesting.restricted = this.formGroupControls.attachTo.value.length > 0 ? this.formGroupControls.attachTo.value : [];
			options.tokenPropertyPermissions.push(CollectionTokenPropertyPermission.make('name', true, true, true))
			options.tokenPropertyPermissions.push(CollectionTokenPropertyPermission.make('description', true, true, true))
			options.tokenPropertyPermissions.push(...this.props);

			try {
				let newCollection = await this.collectionService.createCollection(options);

				if(this.selectedImageData !== '') {
					newCollection.imageData = this.selectedImageData;
					await this.firebaseService.updateCollection(newCollection.id, newCollection);
				}

				this.buttonLoadingState.updateState(false);
				this.snackbarService.show('Collection has been successfully created');
				this.redirectToCollections();
			} catch (e) {
				this.buttonLoadingState.updateState(false);
			}
		}
	}

	public redirectToCollections(): void {
		this.router.navigateByUrl('/collections');
	}

	public onSelectedImage(event: Event): void {
		const file = (event.target as HTMLInputElement).files[0];
		const reader = new FileReader();

		if(file.size > 200000) return;

		reader.onload = () => {
			this.selectedImageData = reader.result as string;

			if(this.isEdit) { this.updatedImage = true; }
		}

		reader.readAsDataURL(file);
	}

	public initCollectionForm(): void {
		if (this.collection) {
			this.formGroupControls.name.setValue(this.collection.name);
			this.formGroupControls.description.setValue(this.collection.description);
			this.props = this.collection.tokenPropertyPermissions;

			if (this.collection.permissions.nesting.restricted.length > 0) {
				this.formGroupControls.attachTo.setValue(this.collection.permissions.nesting.restricted);
			}

			if(this.collection.imageData !== '') {
				this.selectedImageData = this.collection.imageData;
			}

			// Disabled controls
			this.formGroupControls.name.disable();
			this.formGroupControls.description.disable();
		}
	}

}

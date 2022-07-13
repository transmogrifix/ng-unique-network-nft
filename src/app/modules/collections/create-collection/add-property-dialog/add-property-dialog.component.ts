import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { CollectionTokenPropertyPermission } from '../../../../core/model/nft-collection';

@Component({
	selector: 'app-add-property-dialog',
	templateUrl: './add-property-dialog.component.html',
	styleUrls: ['./add-property-dialog.component.scss']
})
export class AddPropertyDialogComponent implements OnInit {
	public formGroupControls = {
		name: new FormControl<string>('', Validators.required),
		admin: new FormControl<boolean>(false),
		owner: new FormControl<boolean>(false),
		mutable: new FormControl<boolean>(false),
	}
	public formGroup = new FormGroup(this.formGroupControls);

	public get canSubmit(): boolean {
		return this.formGroup.valid;
	}

	public onSubmit() {
		let prop: CollectionTokenPropertyPermission = CollectionTokenPropertyPermission.make(
			this.formGroupControls.name.value,
			this.formGroupControls.mutable.value,
			this.formGroupControls.admin.value,
			this.formGroupControls.owner.value);

		this.dialogRef.close(prop)
	}

	constructor(private dialogRef: MatDialogRef<AddPropertyDialogComponent>) { }

	ngOnInit(): void {
	}

}

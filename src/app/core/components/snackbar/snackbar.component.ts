import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule} from "@angular/material/snack-bar";
import {SnackBarConfig, SnackBarState} from "./snackbar.service";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: ['./snackbar.component.scss'],
	imports: [CommonModule, MatIconModule, MatSnackBarModule],
	standalone: true
})
export class SnackbarComponent {

	public msg: string = '';
	public success: boolean = false;
	public error: boolean = false;

	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarConfig) {
		this.msg = data.message;
		this.success = data.state == SnackBarState.Success;
		this.error = data.state == SnackBarState.Error;
	}
}

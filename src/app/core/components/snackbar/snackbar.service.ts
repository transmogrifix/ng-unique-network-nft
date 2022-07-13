import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {SnackbarComponent} from "./snackbar.component";

export enum SnackBarState {
	Success,
	Error
}

export interface SnackBarConfig {
	state: SnackBarState,
	message: string,
	errorColor: string;
	successColor: string;
}


@Injectable({
	providedIn: "root"
})
export class SnackbarService {

	constructor(public snackBar: MatSnackBar) {
	}

	public show(
		message: string,
		state: SnackBarState = SnackBarState.Success,
		duration: number = 2500,
		horizontalPosition: MatSnackBarHorizontalPosition = 'right',
		verticalPosition: MatSnackBarVerticalPosition = 'top'
	) {
		this.snackBar.openFromComponent(SnackbarComponent, {
			horizontalPosition,
			verticalPosition,
			duration: duration,
			data: {
				state: state,
				message: message,
			}
		});
	}
}

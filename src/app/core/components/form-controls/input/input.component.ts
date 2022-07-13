import {ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldAppearance, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormField} from "../form-field";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-input-control',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
  standalone: true,
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true},
	],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatTooltipModule, MatIconModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends FormField<string> {
	@Input() formControl!: FormControl;
	@Input() fieldType: string = 'text';
	@Input() name: string = '';
	@Input() placeholder: string = '';
	@Input() appearance: MatFormFieldAppearance = 'outline';
	@Input() label: boolean = true;
	@Input() isFocus: boolean = false;
	@Input() isMinActive = false;
	@Input() displayErrorMessage: boolean = true;
	@Input() inputClass: string = '';
	@Input() errorMessagePrefix: string = '';
	@Input() svgIcon: string | null = null;
	@Input() tooltipMessage: string | null = null;

	@Output() iconClicked: EventEmitter<void> = new EventEmitter<void>();

	constructor() {
		super();
	}

	public setValue(event: Event): void {
		if (!this.isDisabled) {
			const value = (event.target as HTMLInputElement).value.trim();
			this.writeValue(value);
			this.onChange(value);
			this.onTouch();
		}
	}

	public deleteControlValue(element: HTMLInputElement): void {
		element.value = '';
		this.formControl.setValue('');
	}
}

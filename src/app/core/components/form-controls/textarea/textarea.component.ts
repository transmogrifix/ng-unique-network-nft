import {Component, forwardRef, Input} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule,} from "@angular/forms";
import {FormField} from "../form-field";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";

@Component({
	selector: 'app-textarea-control',
	templateUrl: './textarea.component.html',
	styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true }
	]
})
export class TextareaComponent extends FormField<string> {
	@Input() formControl!: FormControl;
	@Input() placeholder: string = '';
	@Input() name: string = '';
	@Input() rows: string = '5';

	constructor() {
		super();
	}

	public setValue(event: Event) {
		if (!this.isDisabled) {
			const value = (event.target as HTMLTextAreaElement).value;
			this.writeValue(value);
			this.onChange(value);
			this.onTouch();
		}
	}
}

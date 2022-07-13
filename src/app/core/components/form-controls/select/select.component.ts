import {ChangeDetectionStrategy, Component, ContentChildren, forwardRef, Input, QueryList} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatOption} from "@angular/material/core";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {FormField} from "../form-field";

@Component({
	selector: 'app-select-control',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent extends FormField<string> {
	@ContentChildren(MatOption, { descendants: false })
	public set setOptions(options: QueryList<MatOption>) {
		options.changes.subscribe((options) => {
			this.selectOptions = SelectComponent.makeOptions(options);
		})
		this.selectOptions = SelectComponent.makeOptions(options.toArray());
	}
	@Input() formControl!: FormControl;
	@Input() placeholder: string = '';
	@Input() name: string = '';
	@Input() multiple: boolean = false;
	@Input() isHintActive: boolean = false;
	@Input() hintValue: string | null = null;
	@Input() customClass: string = '';
	@Input() panelClass: string = '';
	public selectOptions: any[] = [];

	public get panelCustomClass(): string {
		return `mat-select-option ${this.panelClass}`
	}

	constructor() {
		super();
	}

	public setValue({ value }: MatSelectChange) {
		if (!this.isDisabled) {
			this.writeValue(value);
			this.onChange(value);
			this.onTouch();
		}
	}

	private static makeOptions(options: any[]) {
		return options.map(option => {
			return { value: option.value, viewValue: option.viewValue };
		});
	}
}

import {ControlValueAccessor} from "@angular/forms";


export class FormField<T> implements ControlValueAccessor {
	public value: T | null = null;
	public isDisabled: boolean = false;
	public onChange!: (value: T) => void;
	public onTouch!: () => void;

	public writeValue(value: T): void {
		this.value = value;
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}
}

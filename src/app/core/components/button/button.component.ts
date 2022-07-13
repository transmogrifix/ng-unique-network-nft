import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

export type ButtonType = 'button' | 'submit' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';
export type IconPosition = 'left' | 'right';
export type ButtonVariant = 'primary' | 'secondary' | 'blue' | 'link';

export class ButtonLoadingState {
  private _isDisabled = false;
  private _isLoading = false;

  public get isDisabled(): boolean {
    return this._isDisabled;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  public updateState(value: boolean): void {
    this._isDisabled = value;
    this._isLoading = value;
  }
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class ButtonComponent {
  @Input() buttonTitle: string = '';
  @Input() customClass: string = '';
  @Input() buttonWidth: string = '';
  @Input() buttonHeight: string = '';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() svgIcon: string = '';
  @Input() iconPosition: IconPosition = 'left';
  @Input() onlyIcon: boolean | null = null;
  @Input() type: ButtonType = 'button';
  @Input() size: ButtonSize = 'medium';
  @Input() variant: ButtonVariant = 'primary';
  @Input() route: string = '';
  @Input() buttonLoadingState: ButtonLoadingState | null = null;
  @Input() fullSizeOnMobile: boolean = false;

  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  public get isLoadingActive(): boolean {
    return this.buttonLoadingState ? this.buttonLoadingState.isLoading : this.loading;
  }

  public get className(): string {
    return `${this.variant} ${this.size} ${this.customClass}`;
  }

  public redirectToRoute(): void {
    this.router.navigateByUrl(this.route);
  }
}

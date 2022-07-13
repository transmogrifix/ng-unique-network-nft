import {CommonModule} from "@angular/common";
import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DEFAULT_SIZE, RenderHelper, THEMES_ENUM} from "./render-helper";

@Component({
	selector: 'app-identicon',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './identicon.component.html',
	styleUrls: ['./identicon.component.scss']
})
export class IdenticonComponent implements OnInit {

	private address?: any;
	/**
	 * @field address passed when using the polkadot-angular-identicon tag
	 * to display the icon
	 */

	@Input('address') set setAddress(value: string) {
		this.address = value;
		this.update();
	}

	/**
	 *  @field  size passed when using the polkadot-angular-identicon tag
	 *  to set the icon size
	*/
	@Input() size?: any = DEFAULT_SIZE;

	/**
	* @field  theme passed when using the polkadot-angular-identicon tag
	* to set the theme of the icon
	*/
	@Input() theme?: string = THEMES_ENUM.POLKADOT;


	/**
	* @field  iconHTML : as SafeHTML object that the value will be set by the pickRenderFunction from
	* the RenderHelper class.
	*/
	iconHTML?: SafeHtml;

	constructor(private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit(): void {
		
	}

	private update() {
		this.iconHTML = this.sanitizer.bypassSecurityTrustHtml(
			RenderHelper.pickRenderFunction(this.address, this.theme, this.size)
		);
	}

	/**
	 *
	 * @returns an object that contains the width and height properties in pixel that will be passed
	 * to the angular ngStyle directive in the component (polkadot-angular-identicon) .
	 */
	getStyle() {
		return {
			width: this.size + "px",
			height: this.size + "px",
		};
	}

}

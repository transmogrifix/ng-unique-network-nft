import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from "../button/button.component";
import {RouterModule} from "@angular/router";
import {IdenticonComponent} from '../identicon/identicon.component';
import {AccountService, SelectedAccount} from "../../services/account.service";
import {MatMenuModule} from "@angular/material/menu";
import {map, Observable} from "rxjs";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, ButtonComponent, RouterModule, IdenticonComponent, MatMenuModule],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	public selectedAccount: SelectedAccount = null;
	public allAccounts$: Observable<InjectedAccountWithMeta[]> = this.accountService.accounts$;

	constructor(private accountService: AccountService) {
		accountService.selectedAccount$.subscribe((value) => {
			this.selectedAccount = value;
		})
	}

	public async setCurrentAccount(account: InjectedAccountWithMeta): Promise<void> {
		await this.accountService.selectAccount(account);
	}

	public get currentAddress(): string {
		return !!this.selectedAccount ? this.selectedAccount.account.address : 'none';
	}
}

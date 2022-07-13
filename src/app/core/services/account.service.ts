import {Injectable} from "@angular/core";
import {web3Accounts, web3Enable, web3FromAddress} from "@polkadot/extension-dapp";
import type {InjectedAccountWithMeta, InjectedExtension} from '@polkadot/extension-inject/types';
import {KeyringPair} from "@polkadot/keyring/types";
import keyring from "@polkadot/ui-keyring";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {NodeService} from "./node.service";
import {UniqueHelper} from "./unique-helper";

export class SelectedAccount {
	constructor(public account: InjectedAccountWithMeta, public keyring: KeyringPair, public signer: InjectedExtension) { }


	public async signTransaction(helper: UniqueHelper, transaction: any, transactionLabel?: string): Promise<unknown> {
		return await helper.signTransaction(this.account.address, transaction, transactionLabel, this.signer.signer);
	}
}

@Injectable({
	providedIn: 'root'
})
export class AccountService {
	private readonly storageKey: string = 'selectedAccount';
	private _accounts: BehaviorSubject<InjectedAccountWithMeta[]> = new BehaviorSubject<InjectedAccountWithMeta[]>([]);
	public readonly accounts$: Observable<InjectedAccountWithMeta[]> = this._accounts.asObservable();

	private _selectedAccount: BehaviorSubject<SelectedAccount | null> = new BehaviorSubject<SelectedAccount | null>(null);
	public readonly selectedAccount$: Observable<SelectedAccount | null> = this._selectedAccount.asObservable();
	public get selectedAccount(): SelectedAccount {
		return this._selectedAccount.getValue();
	}

	constructor(private nodeService: NodeService) {

	}

	private initialized: boolean = false;
	public async initialize(): Promise<InjectedAccountWithMeta[]> {
		if (this.initialized)
			return Promise.resolve(this._accounts.value);

		// returns an array of all the injected sources
		// (this needs to be called first, before other requests)
		const allInjected = await web3Enable(environment.appName);

		// returns an array of { address, meta: { name, source } }
		// meta.source contains the name of the extension that provides this account
		const accounts = await web3Accounts();

		keyring.loadAll({
			isDevelopment: environment.developmentKeyring
		}, accounts);

		const accountAddress = this.getAccountAddressFromLocalStorage();
		if(accountAddress !== null) {
			const account = accounts.find((acc) => acc.address === accountAddress);
			await this.selectAccount(account);
		} else if (accounts.length > 0) {
			await this.selectAccount(accounts[0]);
		}

		this._accounts.next(accounts);
		return Promise.resolve(accounts);
	}

	public accounts(): InjectedAccountWithMeta[] {
		return this._accounts.value;
	}

	public async selectAccount(account: InjectedAccountWithMeta | null): Promise<void> {
		let keyringPair = keyring.getPair(account.address);

		this._selectedAccount.next(new SelectedAccount(account, keyringPair, await web3FromAddress(account.address)));
		this.setAccountAddressToLocalStorage(account.address);

		if (account != null) {
			//this.nodeService.uniqueHelper.api.setSigner(this._selectedAccount.signer);
		}
	}

	public setAccountAddressToLocalStorage(accountAddress: string): void {
		localStorage.setItem(this.storageKey, accountAddress);
	}

	public getAccountAddressFromLocalStorage(): string | null {
		return localStorage.getItem(this.storageKey);
	}

	public removeAccountFromLocalStorage() {
		localStorage.removeItem(this.storageKey);
	}
}

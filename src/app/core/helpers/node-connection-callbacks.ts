import { ApiPromise } from "@polkadot/api";

export class NodeConnectionCallbacks {
	private api: ApiPromise | null = null;

	constructor() {
	}

	public setup(api: ApiPromise) {
		this.api = api;
		this.api.on('connected', this.onConnected);
		this.api.on('disconnected', this.onDisconnected);
		this.api.on('error', this.onError);
		this.api.on('ready', this.onReady);
		this.api.on('decorated', this.onDecorated);
	}

	public onConnected() {
	}

	public onDisconnected() {
	}

	public onError() {
	}

	public onReady() {
	}

	public onDecorated() {
	}
}

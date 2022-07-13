import { Injectable } from "@angular/core";
import { ApiPromise } from "@polkadot/api";
import { environment } from "../../../environments/environment";
import { NodeConnectionCallbacks } from "../helpers/node-connection-callbacks";
import { NFTCollection } from "../model/nft-collection";
import { Logger } from "./logger";
import { UniqueHelper, UniqueNFTCollection } from "./unique-helper";


@Injectable({
  providedIn: 'root'
})
export class NodeService {
	private logger: Logger = new Logger();
	public readonly uniqueHelper: UniqueHelper = new UniqueHelper(this.logger);
	private nodeConnectionCallbacks: NodeConnectionCallbacks = new NodeConnectionCallbacks();


	constructor() {
	}

	public async connect(): Promise<void> {
		await this.uniqueHelper.connect(environment.providerSocket, this.nodeConnectionCallbacks);

	}

	public async disconnect(): Promise<void> {
		await this.uniqueHelper.disconnect();
	}


}

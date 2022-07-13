export class CollectionNestingOptions {
	public tokenOwner: boolean;
	public collectionAdmin: boolean;
	public restricted: number[];

	constructor(tokenOwner: boolean = false, collectionAdmin: boolean = false, restricted: number[] = []) {
		this.tokenOwner = tokenOwner;
		this.collectionAdmin = collectionAdmin;
		this.restricted = restricted;
	}
}

export class CollectionPermissions {
	public access: string; // 'Normal' | 'AllowList'
	public mintMode: boolean;
	public nesting: CollectionNestingOptions;

	constructor(access: string = 'Normal', mintMode: boolean = true, nesting: CollectionNestingOptions = new CollectionNestingOptions()) {
		this.access = access;
		this.mintMode = mintMode;
		this.nesting = nesting;
	}
}

export class TokenPropertyPermission {
	mutable: boolean;
	collectionAdmin: boolean;
	tokenOwner: boolean;

	constructor(mutable: boolean = false,
				collectionAdmin: boolean = false,
				tokenOwner: boolean = false) {
		this.mutable = mutable;
		this.collectionAdmin = collectionAdmin;
		this.tokenOwner = tokenOwner;
	}
}

export class CollectionTokenPropertyPermission {
	public key: string;
	public permission: TokenPropertyPermission;

	constructor(key: string = '', permission: TokenPropertyPermission = new TokenPropertyPermission()) {
		this.key = key;
		this.permission = permission;
	}

	static make(key: string, mutable: boolean = false, collectionAdmin: boolean = false, tokenOwner: boolean = false) {
		return new CollectionTokenPropertyPermission(key, new TokenPropertyPermission(mutable, collectionAdmin, tokenOwner));
	}
}

export interface INFTCollection {
	id: number,
	name: string,
	description: string,
	tokensCount: number,
	admins: string[],
	raw: any,
	normalizedOwner: string;
	imageData: string;
}

export class NFTCollection implements INFTCollection {
	public id: number;
	public name: string;
	public description: string;
	public tokensCount: number;
	public admins: string[];
	public raw: any;
	public normalizedOwner: string;
	public permissions: CollectionPermissions = new CollectionPermissions();
	public tokenPropertyPermissions: CollectionTokenPropertyPermission[] = [];
	public imageData: string;

	constructor(
		id: number = 0,
		name: string = '',
		description: string = '',
		tokensCount: number = 0,
		admins: string[] = [],
		raw: any = undefined,
		normalizedOwner: string = '',
		imageData: string = ''
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.tokensCount = tokensCount;
		this.admins = admins;
		this.raw = raw;
		this.normalizedOwner = normalizedOwner;
		this.permissions = new CollectionPermissions(raw.permissions.access, raw.permissions.mintMode, new CollectionNestingOptions(raw.permissions.nesting.tokenOwner, raw.permissions.nesting.collectionAdmin, raw.permissions.nesting.restricted ?? []))
		this.imageData = imageData;
		this.tokenPropertyPermissions = raw.tokenPropertyPermissions.map(e => CollectionTokenPropertyPermission.make(e.key, e.permission.mutable, e.permission.collectionAdmin, e.permission.tokenOwner));
	}

	static from(value: INFTCollection): NFTCollection {
		return new NFTCollection(
			value.id,
			value.name,
			value.description,
			value.tokensCount,
			value.admins,
			value.raw,
			value.normalizedOwner,
			value.imageData
		)
	}

	public toObject(): INFTCollection {
		return JSON.parse(JSON.stringify(this));
	}
}

export interface IProperty {
	Name: string;
	Value: string;
}

export class Property implements IProperty {
	Name: string;
	Value: string;

	constructor(
		name: string = '',
		value: string = ''
	) {
		this.Name = name;
		this.Value = value;
	}

	static from(value: IProperty): Property {
		return new Property(value.Name, value.Value);
	}
}

export interface ITokenAndCollectionIds {
	collection: number;
	token: number;
}

export class TokenAndCollectionIds implements ITokenAndCollectionIds {
	collection: number;
	token: number;

	constructor(collection: number, token: number) {
		this.collection = collection;
		this.token = token;
	}

	static from(value: ITokenAndCollectionIds): TokenAndCollectionIds {
		return new TokenAndCollectionIds(value.collection, value.token);
	}
}

export interface INft {
	Name: string;
	Description: string;
	ImageData: string;
	TokenId: number;
	CollectionId: number;
	Owner: string;
	Properties: IProperty[];
	Children: ITokenAndCollectionIds[];
	ParentId: ITokenAndCollectionIds;
}

export class Nft implements INft {
	Name: string;
	Description: string;
	ImageData: string;
	TokenId: number;
	CollectionId: number;
	Owner: string;
	Properties: Property[];
	Children: TokenAndCollectionIds[];
	ParentId: TokenAndCollectionIds;

	constructor(
		name: string = '',
		description: string = '',
		imageData: string = '',
		tokenId: number = 0,
		collectionId: number = 0,
		owner: string = '',
		properties: Property[] = [],
		children: TokenAndCollectionIds[] = [],
		parentId: TokenAndCollectionIds = new TokenAndCollectionIds(0, 0)
	) {
		this.Name = name;
		this.Description = description;
		this.ImageData = imageData;
		this.TokenId = tokenId;
		this.CollectionId = collectionId;
		this.Owner = owner;
		this.Properties = properties;
		this.Children = children;
		this.ParentId = parentId;
	}

	static from(value: INft): Nft {
		return new Nft(
			value.Name,
			value.Description,
			value.ImageData,
			value.TokenId,
			value.CollectionId,
			value.Owner,
			value.Properties.map(p => Property.from(p)),
			!!value.Children ? value.Children.map(e => TokenAndCollectionIds.from(e)) : [],
			TokenAndCollectionIds.from(value.ParentId)
		);
	}

	public toObject(): INft {
		return JSON.parse(JSON.stringify(this));
	}
}

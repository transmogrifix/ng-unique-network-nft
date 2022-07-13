import { INft, Nft } from "./nft";

export interface ITreeNode {
	nft: INft;
	name: string;
	value: number;
	children: ITreeNode[] | null;
	color: string;
}

export class TreeNode implements ITreeNode {
	name: string;
	nft: Nft;
	value: number;
	children: TreeNode[] | null;
	color: string;

	constructor(
		name: string = '',
		nft: Nft,
		value: number = 0,
		children: TreeNode[] = [],
		color: string = ''
	) {
		this.name = nft.Name;
		this.nft = nft;
		this.value = value;
		this.children = children;
		this.color = color
	}

	static from(value: ITreeNode): TreeNode {
		return new TreeNode(
			value.name,
			Nft.from(value.nft),
			value.value,
			value.children ? value.children.map((c) => TreeNode.from(c)) : [],
			value.color
		);
	}

	public findNode(callbackFn: (value: TreeNode) => boolean): TreeNode | null{
		if (callbackFn(this))
			return this;

		for (let c of this.children) {
			let res = c.findNode(callbackFn);
			if (res)
				return res;
		}
	}
}

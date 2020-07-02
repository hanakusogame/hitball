import { Player } from "./player";

//ボールクラス
export class Ball extends g.Sprite {
	public player: Player;
	public isMove: boolean;
	public isCatch: boolean;
	public moveX: number;
	public moveY: number;
	public speed: number;
	public stop: () => void;
	public catch: () => void;

	constructor(scene: g.Scene) {
		super({
			scene: scene,
			src: scene.assets["ball"] as g.ImageAsset,
			width: 32,
			height: 32,
			srcX: 32,
			x: 305,
			y: 180
		});

		this.isMove = false;
		this.isCatch = false;

		const b = new g.Sprite({
			scene: scene,
			src: scene.assets["ball"] as g.ImageAsset,
			width: 32,
			height: 32,
			y: -6
		});
		this.append(b);

		this.stop = () => {
			b.y = -6;
			b.modified();
			this.isMove = false;
		}

		this.catch = () => {
			b.y = -18;
			b.modified();
			this.isMove = false;
			this.isCatch = true;
		}

	}
}
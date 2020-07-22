import { Player } from "./player";

//ボールクラス
export class Ball extends g.Sprite {
	public player: Player;
	public isMove: boolean;
	public isCollision: boolean = false;
	public isCatch: boolean;
	public moveX: number;
	public moveY: number;
	public speed: number;
	public stop: () => void;
	public catch: () => void;
	public spr: g.Sprite;
	
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
		this.moveX = 0;
		this.moveY = 0;
		this.speed = 0;

		const b = new g.Sprite({
			scene: scene,
			src: scene.assets["ball"] as g.ImageAsset,
			width: 32,
			height: 32,
			y: -6
		});
		this.append(b);
		this.spr = b;

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
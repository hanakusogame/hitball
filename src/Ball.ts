import { Player } from "./player";
import { Timeline } from "@akashic-extension/akashic-timeline";

//ボールクラス
export class Ball extends g.Sprite {
	public player: Player;
	public isMove: boolean;
	public isCollision: boolean;
	public isCatch: boolean;
	public moveX: number;
	public moveY: number;
	public speed: number;
	public stop: () => void;
	public catch: () => void;
	public init: () => void;
	public spr: g.Sprite;
	
	constructor(scene: g.Scene) {
		super({
			scene: scene,
			src: scene.assets["ball"] as g.ImageAsset,
			width: 32,
			height: 32,
			srcX: 32,
		});

		const timeline = new Timeline(scene);

		const b = new g.Sprite({
			scene: scene,
			src: scene.assets["ball"] as g.ImageAsset,
			width: 32,
			height: 32,
			y: -6
		});
		this.append(b);
		this.spr = b;

		//初期化処理
		this.init = () => {

			this.spr.y = -250;
			this.spr.scale(1.3);
			this.spr.modified();
			this.spr.opacity = 0;

			this.player = null;
			this.isMove = false;
			this.isCatch = false;
			this.moveX = 0;
			this.moveY = 0;
			this.speed = 0;
			this.isCollision = false;

			timeline.create(this.spr).scaleTo(1, 1, 2000).con().moveTo(0, -6, 2000)
				.con().every((_, b) => {
					this.spr.opacity = b;
				}, 2000).wait(1000).call(() => {
					this.isCollision = true;
				});
		}

		//ストップ
		this.stop = () => {
			b.y = -6;
			b.modified();
			this.isMove = false;
		}

		//キャッチ
		this.catch = () => {
			b.y = -18;
			b.modified();
			this.isMove = false;
			this.isCatch = true;
		}

	}
}
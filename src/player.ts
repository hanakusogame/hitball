//プレイヤークラス
export class Player extends g.E {
	public radian: number;//角度
	public distance: number;//距離
	public isMove: boolean;//移動中
	public isCollision: boolean;//当たり判定の有無(無敵状態)
	public stateCatch: number;//掴める状態を表す値
	public isCatch: boolean;//ボールを掴んでいる状態
	public isDie: boolean;
	public speed: number;//移動速度
	public setAngle: (x: number) => void;
	public direction: number;
	public stop: () => void;
	public move: () => void;
	public catch: () => void;
	public die: () => void;//死亡処理
	public hit: (x: number) => void;
	public setRanking: () => void;
	public name: string;
	public life: number;//ライフ
	public hitCnt: number;//ボールを当てた回数
	public isHuman: boolean;

	constructor(scene: g.Scene, id: string, name: string, isHuman:boolean, font: g.Font) {

		super({
			scene: scene,
			x: g.game.random.get(30, 640 - 50 - 30),
			y: g.game.random.get(50, 360 - 50 - 20),
			width: 50,
			height: 50,
			tag: id
		});

		this.isMove = false;
		this.isCollision = true;
		this.stateCatch = 0;
		this.isCatch = false;
		this.name = name;
		this.life = 3;
		this.isDie = false;
		this.hitCnt = 0;
		this.isHuman = isHuman;

		//体のフレームをライフによって変えて取得
		const getFrames: (arr: number[]) => number[] = (arr) => {
			return arr.map(i => i + ((3 - this.life) * 6));
		};

		//影
		const srcShadow = scene.assets["cursor"] as g.ImageAsset;
		const shadow = new g.Sprite({
			scene: scene,
			src: srcShadow,
			width: 40,
			height: 25,
			y: 25,
			x: 5,
			srcY: 20
		});
		this.append(shadow);

		//体
		const src = scene.assets["player_body"] as g.ImageAsset;
		const body = new g.FrameSprite({
			scene: scene,
			src: src,
			y: -4,
			width: 50,
			height: 50,
			frames: getFrames([1, 3]),
			interval: 100
		});
		body.start();
		this.append(body);

		//頭
		const head = new g.FrameSprite({
			scene: scene,
			src: scene.assets["player_head"] as g.ImageAsset,
			y: -27,
			width: 50,
			height: 50,
			frames: [1, 3],
			scaleX: 0.9,
			scaleY: 0.9,
			interval: 100
		});
		head.start();
		body.append(head);

		//名前表示用ラベル
		const labelName = new g.Label({
			scene: scene,
			font: font,
			fontSize: 14,
			text: name,
			y: -45,
			x: -25,
			textAlign: g.TextAlign.Center,
			widthAutoAdjust: false,
			width: 110
		});
		this.append(labelName);

		//方向転換
		this.setAngle = (x) => {
			this.direction = x;
			body.scaleX = x;
			body.modified();
		}

		//止まる
		this.stop = () => {
			this.isMove = false;

			if (!this.isDie) {
				body.frames = getFrames([1, 3]);
				body.frameNumber = 0;

				head.frames = [1, 3];
				head.frameNumber = 0;

				body.angle = 0;
				body.modified();
			}
		}

		//動きだす
		this.move = () => {
			if (!this.isDie) {
				this.isMove = true;

				body.frames = getFrames([0, 1, 2, 1]);
				body.frameNumber = 0;

				head.frames = [0, 1, 2, 1];
				head.frameNumber = 0;

				body.modified();
			}
		}

		//取る
		this.catch = () => {
			if (this.stateCatch === 0) {
				this.stateCatch = 1;
				body.frames = getFrames([4]);
				body.frameNumber = 0;
				this.modified();
				scene.setTimeout(() => {
					this.stateCatch = 2;
					this.stop();
					scene.setTimeout(() => {
						this.stateCatch = 0;
					}, 600);
				}, 600);
			}
		}

		//当たる
		this.hit = (x: number) => {

			body.frames = getFrames([5]);
			body.frameNumber = 0;

			head.frames = [5];
			head.frameNumber = 0;

			body.angle = (x > 0) ? -45 : 45;
			body.modified();

			if(this.life > 0) this.life--;

			//無敵時間
			this.isCollision = false;
			scene.setTimeout(() => {
				this.isCollision = true
			}, 1000);

		}

		//死亡
		this.die = () => {
			body.frames = [18];
			body.frameNumber = 0;

			head.frames = [6];
			head.frameNumber = 0;

			body.angle = 0;
			body.modified();
			this.isDie = true;
			this.life = 0;
		}

		let isEnd = false;

		this.update.add(()=>{
			if (this.isDie && !isEnd) {
				if (head.y < 5) {
					head.y += 3;
					head.modified();
				} else {
					head.x += (this.direction * 0.2);
					head.angle += (this.direction );
					head.modified();
				}
			}
		});

		this.setRanking = () => {
			head.x = 0;
			labelName.hide();
			this.show();
			isEnd = true;
		}

	}
}
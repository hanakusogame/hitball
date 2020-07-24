export class SelectBox extends g.E {
	public static lastJoinId:string
	public setNum: (num: number) => void;
	public user:number = 0;
	constructor(scene: g.Scene, font: g.Font, x: number, y: number, title: string, arr: string[], public num: number = 0) {
		super({
			scene: scene,
			x: x,
			y: y
		});

		this.setNum = () => { };

		const labelTitle = new g.Label({
			scene: scene,
			font: font,
			fontSize: 40,
			text: title,
		});
		this.append(labelTitle);

		const src = scene.assets["button2"] as g.ImageAsset;
		const sprLeft = new g.Sprite({
			scene: scene,
			src: src,
			y: 50,
			scaleX: -1,
			touchable: true
		});
		this.append(sprLeft);

		const sprMain = new g.FilledRect({
			scene: scene,
			width: 200,
			height: src.height,
			x: src.width + 5,
			y: 50,
			cssColor: "white"
		});
		this.append(sprMain);

		const label = new g.Label({
			scene: scene,
			font: font,
			fontSize: 50,
			text: arr[num],
			y: 10,
			width: sprMain.width,
			widthAutoAdjust: false,
			textAlign: g.TextAlign.Center
		});
		sprMain.append(label);

		const sprRight = new g.Sprite({
			scene: scene,
			src: src,
			x: sprMain.width + src.width + 10,
			y: 50,
			touchable: true
		});
		this.append(sprRight);

		const chkUser = (id:string) => {
			if (this.user === 0) {
				if (SelectBox.lastJoinId !== id) return false;
			}
			return true;
		}

		sprLeft.pointDown.add(e => {
			if (!chkUser(e.player.id)) return;
			num = (num + arr.length - 1) % arr.length
			label.text = arr[num];
			label.invalidate();
			this.setNum(num);
		});

		sprRight.pointDown.add(e => {
			if (!chkUser(e.player.id)) return
			num = (num + 1) % arr.length
			label.text = arr[num];
			label.invalidate();
			this.setNum(num);
		});

	}
}
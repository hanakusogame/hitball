import { Label } from "@akashic-extension/akashic-label";
import { Timeline } from "@akashic-extension/akashic-timeline";
import MultiKeyboard = require("./MultiKeyboard");
import key = require("./define");

const game = g.game;

const enum ButtonState {
	ON,
	OFF
}

export class Input extends g.E {
	public users: { [key: string]: string };
	public time: number;
	public life: number;
	public endEvent: () => void;

	constructor(pram: g.EParameterObject) {
		super(pram);
		const scene = pram.scene;
		const timeline = new Timeline(scene);
		this.users = {};
		this.time = 2;
		this.life = 3;

		const base = new g.E({
			scene: scene,
			width: 1280,
			height: 720,
			scaleX: 0.5,
			scaleY: 0.5,
			anchorX: 0,
			anchorY: 0
		})
		this.append(base);

		const font = new g.DynamicFont({
			game: game,
			fontFamily: g.FontFamily.SansSerif,
			size: 50,
			fontWeight: 1
		});

		const glyph = JSON.parse((scene.assets["notosansGlyph"] as g.TextAsset).data);
		const keyboardFont = new g.BitmapFont({
			src: scene.assets["notosansFont"],
			map: glyph,
			defaultGlyphWidth: 72,
			defaultGlyphHeight: 72
		});

		const name = new Label({
			scene: scene,
			text: "",
			textColor: "black",
			width: 640,
			y: 550,
			x: 50,
			font: font,
			fontSize: 32,
			textAlign: g.TextAlign.Left
		});
		base.append(name);

		const numLabel = new Label({
			scene: scene,
			text: "",
			textColor: "black",
			width: 200,
			y: 620,
			x: 900,
			font: font,
			fontSize: 50,
			textAlign: g.TextAlign.Left
		});
		base.append(numLabel);

		//情報表示(未使用)
		const infoLabel = new Label({
			scene: scene,
			text: "",
			textColor: "black",
			width: 400,
			y: 550,
			x: 440,
			font: font,
			fontSize: 40,
			textAlign: g.TextAlign.Center
		});
		base.append(infoLabel);

		//ヘルプ
		const helpLabel = new Label({
			scene: scene,
			text: "ボールをぶつけ合うゲームです\r3回ぶつかるか場外に出ると退場\r自機をクリックでボールが取れます\r最後まで生き残った人の勝ち\r参加人数は無制限です",
			textColor: "black",
			width: 1000,
			y: 150,
			x: 200,
			font: font,
			fontSize: 50,
			textAlign: g.TextAlign.Left
		});
		base.append(helpLabel);

		//ライフ変更用
		let life = 2;
		base.append(new g.Label({
			scene: scene,
			x: 350,
			y: 460,
			font: font,
			fontSize: 40,
			text: "ライフ"
		}));

		const sprLife = new g.FilledRect({
			scene: scene,
			x: 400,
			y: 510,
			width: 280,
			height: 80,
			cssColor: "white",
			touchable: true
		});
		base.append(sprLife);

		const labelLife = new g.Label({
			scene: scene,
			x: 120,
			y: 10,
			font: font,
			fontSize: 50,
			text: "3",
		});
		sprLife.append(labelLife);

		sprLife.pointDown.add(e => {
			if (lastJoinPlayerId !== e.player.id) return;
			life = (life + 1) % 3;
			labelLife.text = "" + (life + 1);
			labelLife.invalidate();
			this.life = life + 1;
		});

		//時間変更用
		let time = 1;
		base.append(new g.Label({
			scene: scene,
			x: 800,
			y: 460,
			font: font,
			fontSize: 40,
			text: "制限時間"
		}));

		const sprTime = new g.FilledRect({
			scene: scene,
			x: 850,
			y: 510,
			width: 280,
			height: 80,
			cssColor: "white",
			touchable:true
		});
		base.append(sprTime);


		const labelTime = new g.Label({
			scene: scene,
			x: 80,
			y: 10,
			font: font,
			fontSize: 50,
			text: "2:00"
		});
		sprTime.append(labelTime);

		sprTime.pointDown.add(e => {
			if (lastJoinPlayerId  !== e.player.id) return;
			time = (time + 1) % 5;
			labelTime.text = "" + (time + 1) + ":00";
			labelTime.invalidate();
			this.time = time + 1;
		});

		// マルチキーボードインスタンスの生成
		const keyboard = new MultiKeyboard({
			scene: scene,
			font: keyboardFont,
			sceneAssets: scene.assets,
			maxLength: 8,
			y: 720,
			local: true
		});
		base.append(keyboard);

		let state = ButtonState.OFF;
		const openAsset = (scene.assets["open"] as g.ImageAsset);
		const closeAsset = (scene.assets["close"] as g.ImageAsset);
		const buttonAsset = (scene.assets["button"] as g.ImageAsset);
		const keyboardButton = new g.Pane({
			scene: scene,
			width: openAsset.width,
			height: openAsset.height,
			x: 50,
			y: 610,
			backgroundImage: openAsset,
			touchable: true,
			local: true
		});
		keyboardButton.hide();

		keyboardButton.pointDown.add(e => {
			switch (state) {
				case ButtonState.OFF:
					keyboardButton.backgroundImage = g.Util.asSurface(closeAsset);
					timeline.create(keyboard).moveTo(0, 0, 150);
					state = ButtonState.ON;
					break;
				case ButtonState.ON:
					name.text = keyboard.text;
					name.invalidate();
					keyboardButton.backgroundImage = g.Util.asSurface(openAsset);
					timeline.create(keyboard).moveTo(0, 720, 150);
					state = ButtonState.OFF;

					e.player.name = keyboard.text;
					g.game.raiseEvent(new g.MessageEvent({ msg: "rename", player: e.player }));

					break;
			}
			keyboardButton.invalidate();
		});
		base.append(keyboardButton);

		//受付開始、参加、参加済み、受付終了の表示用
		const joinButton = new g.Pane({
			scene: scene,
			width: buttonAsset.width,
			height: buttonAsset.height,
			x: (1280 - buttonAsset.width) / 2,
			y: 610,
			backgroundImage: buttonAsset,
			touchable: true,
			local: true
		});
		base.append(joinButton);
		joinButton.hide();

		const strStates = ["受付待ち", "参加", "参加済み", "受付終了"]
		const labelState = new g.Label({
			scene: scene,
			font: font,
			text: "受付待ち",
			fontSize: 50,
			y: 10,
			width: buttonAsset.width,
			textAlign: g.TextAlign.Center,
			widthAutoAdjust: false,
			textColor: "white",
			tag: 0,
			local: true
		});
		joinButton.append(labelState);

		//グローバルイベントでプレイヤー情報追加
		scene.message.add((msg) => {
			// 関係ないイベントは無視して抜ける
			if (!msg.data || !msg.data.player) return;

			if (msg.data.msg === "start" || msg.data.msg === "add") {
				//受付開始
				const p = msg.data.player;
				const num = Object.keys(this.users).length;
				p.name = msg.data.msg === "start" ? "ほうそうしゃ" : "げすと" + num;
				this.users[p.id] = p.name;
				if (p.id === g.game.selfId) {
					name.text = p.name;
					keyboard.text = name.text;
					name.invalidate();
				}

				numLabel.text = (num+1) + "人";
				numLabel.invalidate();

				if (msg.data.msg === "start") {
					if (joinButton.state & 1) {
						labelState.tag = 1;
						labelState.text = strStates[labelState.tag];
						labelState.invalidate();
						joinButton.show();
					}
				}
			}

			else if (msg.data.msg === "rename") {
				const p = msg.data.player;
				this.users[p.id] = p.name;
			}

			else if (msg.data.msg === "end") {
				//if (Object.keys(this.users).length > 1) {
					this.endEvent();
				// } else {
				// 	infoLabel.text = "人数が足りません";
				// 	infoLabel.invalidate();
				// }
			}
		});

		//クリックイベント(ローカル)
		joinButton.pointDown.add(e => {
			if (labelState.tag === 2) return;

			//受付待ち
			if (labelState.tag === 0) {
				keyboardButton.show();
				labelState.tag = 3;
				labelState.text = strStates[labelState.tag];
				labelState.invalidate();
				g.game.raiseEvent(new g.MessageEvent({ msg: "start", player: e.player }));
			}

			//参加
			else if (labelState.tag === 1) {
				keyboardButton.show();
				labelState.tag = 2;
				labelState.text = strStates[labelState.tag];
				labelState.invalidate();
				g.game.raiseEvent(new g.MessageEvent({ msg: "add", player: e.player }));
			}

			//受付終了
			else if (labelState.tag === 3) {
				g.game.raiseEvent(new g.MessageEvent({ msg: "end", player: e.player }));
			}

		});

		let lastJoinPlayerId: string = null;
		g.game.join.add(function (ev) {
			lastJoinPlayerId = ev.player.id;
			if (g.game.selfId === ev.player.id) {
				joinButton.show();
			}
		});

		if (typeof window !== "undefined" && window.RPGAtsumaru) {
			joinButton.show();
		}

	}
}
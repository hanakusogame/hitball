import { SelectBox } from './SelectBox';
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
	public users: { [key: string]: string } = {};
	public time: number = 3;
	public life: number = 3;
	public level: number = 1;
	public ballNum: number = 2;
	public limit: number = 3;
	public endEvent: () => void;
	public lastJoinPlayerId: string;
	public resetCnt: number = 2;
	public startEvent: () => void;

	constructor(pram: g.EParameterObject) {
		super(pram);
		const scene = pram.scene;
		const timeline = new Timeline(scene);

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
		if (!(typeof window !== "undefined" && window.RPGAtsumaru)) {
			base.append(name);
		}

		const numLabel = new Label({
			scene: scene,
			text: "",
			textColor: "black",
			width: 200,
			y: 540,
			x: 600,
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

		//タイトル
		const title = new g.Sprite({
			scene: scene,
			src: scene.assets["title"]
		});
		base.append(title);

		//人数制限
		const playerLimit = new SelectBox(scene, font, 850, 100, "人数制限", ["20人", "30人", "40人", "無制限"], 3);
		base.append(playerLimit);
		playerLimit.setNum = n => { this.limit = n };

		//ボールの数変更用
		const selectBall = new SelectBox(scene, font, 850, 250, "ボールの数", ["1個", "2個", "3個"], 1);
		base.append(selectBall);
		selectBall.setNum = n => { this.ballNum = n + 1 };

		//ライフ変更用
		this.life = 3;
		const selectLife = new SelectBox(scene, font, 850, 400, "ライフ", ["1", "2", "3"], 2);
		base.append(selectLife);
		selectLife.setNum = n => { this.life = n + 1 };

		//時間変更用
		const selectTime = new SelectBox(scene, font, 850, 550, "時間制限", ["2:00", "3:00", "4:00", "5:00"], 1);
		base.append(selectTime);
		selectTime.setNum = n => { this.time = n + 2 };

		//botの強さ
		if (typeof window !== "undefined" && window.RPGAtsumaru) {
			const selectLevel = new SelectBox(scene, font, 50, 550, "botの強さ", ["弱い", "普通", "強い"], 1);
			selectLevel.user = 1;
			base.append(selectLevel);
			selectLevel.setNum = n => { this.level = n };
		}

		// マルチキーボードインスタンスの生成
		const keyboard = new MultiKeyboard({
			scene: scene,
			font: font,
			sceneAssets: scene.assets,
			maxLength: 8,
			y: 720,
			local: true
		});
		base.append(keyboard);

		let state = ButtonState.OFF;
		const buttonAsset = (scene.assets["button"] as g.ImageAsset);
		const keyboardButton = new g.Sprite({
			scene: scene,
			width: buttonAsset.width,
			height: buttonAsset.height,
			x: 50,
			y: 610,
			src: buttonAsset,
			touchable: true,
			local: true
		});
		keyboardButton.hide();

		const keyboardLabel = new g.Label({
			scene: scene,
			x: 30,
			y: 10,
			font: font,
			fontSize: 50,
			text: "名前入力",
			textColor: "white",
			local: true
		});

		keyboardButton.append(keyboardLabel);

		keyboardButton.pointDown.add(e => {
			switch (state) {
				case ButtonState.OFF:
					keyboardLabel.text = "決定";
					keyboardLabel.invalidate();
					timeline.create(keyboard).moveTo(0, 0, 150);
					state = ButtonState.ON;
					break;
				case ButtonState.ON:
					name.text = keyboard.text;
					name.invalidate();
					keyboardLabel.text = "名前入力";
					keyboardLabel.invalidate();
					timeline.create(keyboard).moveTo(0, 720, 150);
					state = ButtonState.OFF;

					e.player.name = keyboard.text;

					if (e.player.id !== this.lastJoinPlayerId && useLocalStorage()) {
						localStorage.setItem('nickname', e.player.name);
					}
					g.game.raiseEvent(new g.MessageEvent({ msg: "rename", player: e.player }));

					break;
			}
			keyboardButton.invalidate();
		});

		if (!(typeof window !== "undefined" && window.RPGAtsumaru)) {
			base.append(keyboardButton);
		}

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

		const strStates = ["受付待ち", "参加", "参加済み", "受付終了", "開始待ち"]
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
		this.message.add((msg) => {
			// 関係ないイベントは無視して抜ける
			if (!msg.data || !msg.data.player) return;

			if (msg.data.msg === "start" || msg.data.msg === "add") {
				//受付開始
				const p = msg.data.player;
				const num = Object.keys(this.users).length;

				let n = "ゲスト" + num;
				if (p.name) {
					n = p.name;
				}
				p.name = msg.data.msg === "start" ? "放送者" : n;
				this.users[p.id] = p.name;
				if (p.id === g.game.selfId) {
					name.text = p.name;
					keyboard.text = name.text;
					name.invalidate();
				}

				numLabel.text = (num + 1) + "人";
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
				this.endEvent();
			}
		});

		const useLocalStorage = () => {
			try {
				if (typeof window.localStorage !== 'undefined') {
					localStorage.setItem('dummy', '1');
					if (localStorage.getItem('dummy') === '1') {
						localStorage.removeItem('dummy');
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} catch (e) {
				return false;
			}
		}

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

				if (useLocalStorage()) {
					e.player.name = localStorage.getItem('nickname');
				}

				g.game.raiseEvent(new g.MessageEvent({ msg: "add", player: e.player }));
			}

			//受付終了
			else if (labelState.tag === 3) {
				labelState.tag = 2;
				labelState.text = strStates[4];
				labelState.invalidate();
				g.game.raiseEvent(new g.MessageEvent({ msg: "end", player: e.player }));
			}

		});

		g.game.join.add((ev) => {
			this.lastJoinPlayerId = ev.player.id;
			SelectBox.lastJoinId = this.lastJoinPlayerId;
			if (g.game.selfId === ev.player.id) {
				joinButton.show();
			}
		});

		if (typeof window !== "undefined" && window.RPGAtsumaru) {
			this.lastJoinPlayerId = g.game.selfId;
			joinButton.show();
		}

		this.startEvent = () => {
			if (g.game.selfId === this.lastJoinPlayerId) {
				labelState.tag = 0;
				labelState.text = strStates[0];
				labelState.invalidate();
				joinButton.show();
			} else {
				joinButton.hide();
			}
			keyboardButton.hide();
			name.text = "";
			name.invalidate();
			numLabel.text = "";
			numLabel.invalidate()
			this.users = {};
		}

	}
}
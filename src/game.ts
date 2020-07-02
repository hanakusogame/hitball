import { Timeline } from "@akashic-extension/akashic-timeline";
import { Player } from "./player";
import { Ball } from "./Ball";
import { Ranking } from "./Ranking";

export class Game extends g.E {

	public start: (players: { [key: string]: string }, life: number, time: number) => void;

	constructor(pram: g.EParameterObject) {
		super(pram);
		const scene = pram.scene;

		const timeline = new Timeline(scene);
		//プレイヤーのリスト
		const players: { [key: string]: Player } = {};
		let isStart = false;
		let timeLimit = 120;
		let dieCnt = 0; //死んだ数

		//背景
		const bg = new g.FilledRect({
			scene: scene,
			width: g.game.width,
			height: g.game.height,
			cssColor: "green",
			opacity: 0.8
		});
		this.append(bg);

		//コート
		const court = new g.Sprite({
			scene: scene,
			src: scene.assets["court"],
			y: 30
		});
		bg.append(court);

		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			fontWeight: g.FontWeight.Bold,
			size: 15
		});

		const font2 = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			fontWeight: g.FontWeight.Bold,
			size: 24
		});

		//時間表示
		const labelTime = new g.Label({
			scene: scene,
			font: font2,
			fontSize: 24,
			text: "ボールぶつけ",
			x: 220,
			y: 6,
			width: 200,
			widthAutoAdjust: false,
			textAlign: g.TextAlign.Center,
			textColor: "white"
		});
		this.append(labelTime);

		//情報表示
		const labelInfo = new g.Label({
			scene: scene,
			font: font2,
			fontSize: 20,
			text: "",
			x: 35,
			y: 5,
			textColor: "white"
		});
		this.append(labelInfo);

		//カーソル用ローカルエンティティ
		const localE = new g.E({
			scene: scene,
			width: g.game.width,
			height: g.game.height,
			touchable: true,
			local: true,
			opacity: 0.8
		});
		this.append(localE);

		//自分のプレイヤー位置表示用カーソル
		const cursorNow = new g.Sprite({
			scene: scene,
			x: -70,
			width: 70,
			height: 70,
			src: scene.assets["cursor"],
			srcX: 70,
			touchable: true
		});
		localE.append(cursorNow);

		//移動先表示位置カーソル
		const cursorNext = new g.Sprite({
			scene: scene,
			x: -70,
			width: 70,
			height: 70,
			src: scene.assets["cursor"],
			srcX: 70
		});
		localE.append(cursorNext);

		//プレイヤーを載せるエンティティ
		const playerE = new g.E({
			scene: scene,
			width: g.game.width,
			height: g.game.height,
		});
		this.append(playerE);

		//ボールを載せるエンティティ
		const ballE = new g.E({
			scene: scene
		});
		this.append(ballE);

		//ボール
		const ball = new Ball(scene);

		//ランキング
		const ranking = new Ranking(scene, font2);

		//音声再生
		const playSound = (name: string, vol: number) => {
			const audio = (scene.assets[name] as g.AudioAsset).play();
			audio.changeVolume(vol);
			return audio;
		}

		//BGMの切り替えボタン
		const bgm = playSound("bgm", 0.4);
		const buttonBGM = new g.FilledRect({
			scene: scene,
			x: 450,
			y: 5,
			width: 80,
			height: 30,
			cssColor: "white",
			touchable: true,
			local: true
		});
		localE.append(buttonBGM);

		buttonBGM.pointDown.add(() => {
			if (buttonBGM.cssColor === "white") {
				bgm.changeVolume(0);
				buttonBGM.cssColor = "gray"
			} else {
				bgm.changeVolume(0.4);
				buttonBGM.cssColor = "white"
			}
			buttonBGM.modified();
		});

		const labelBGM = new g.Label({
			scene: scene,
			font: font2,
			x: 14,
			y: 2,
			fontSize: 20,
			text: "BGM"
		});
		buttonBGM.append(labelBGM);


		//SEの切り替えボタン
		let seVol = 0.5;
		const buttonSE = new g.FilledRect({
			scene: scene,
			x: 550,
			y: 5,
			width: 80,
			height: 30,
			cssColor: "white",
			touchable: true,
			local: true
		});
		localE.append(buttonSE);

		const labelSE = new g.Label({
			scene: scene,
			font: font2,
			x: 25,
			y: 2,
			fontSize: 20,
			text: "SE"
		});
		buttonSE.append(labelSE);

		buttonSE.pointDown.add(() => {
			if (buttonSE.cssColor === "white") {
				seVol = 0;
				buttonSE.cssColor = "gray"
			} else {
				seVol = 0.5;
				buttonSE.cssColor = "white"
			}
			buttonSE.modified();
		});

		const finish = () => {
			isStart = false;
			labelTime.text = "終了";
			labelTime.invalidate();

			const arr = Object.keys(players).map((key) => players[key]);

			this.append(ranking);

			timeline.create(ranking).moveY(30, 4000).call(() => {
				ranking.setPlayers(arr);
			});

			playSound("se_timeup", seVol);
		}

		//投げる
		const throwBall = (p: Player) => {
			ball.isMove = true;
			ball.isCatch = false;
			ball.moveY = Math.sin(p.radian);
			ball.moveX = Math.cos(p.radian);
			ball.speed = (p.speed + 2);
			p.isCatch = false;

			//自分の投げたボールに当たらないように無敵時間を作る
			p.isCollision = false;
			scene.setTimeout(() => { p.isCollision = true }, 700);

			playSound("se_move", seVol);
		};

		//ゲームループ
		this.update.add(() => {
			if (!isStart) return;

			timeLimit -= (1 / 30);
			const min = Math.floor(timeLimit / 60);
			const sec = Math.floor(timeLimit % 60);
			labelTime.text = min + ":" + ('00' + sec).slice(-2);

			if (timeLimit <= 0) {
				finish();
				return;
			}
			labelTime.invalidate();

			for (let key in players) {
				const p = players[key];

				//botの時移動先を指定
				if (!p.isHuman && !p.isMove) {
					if (g.game.random.get(0, 50) === 0) {
						const x = g.game.random.get(50, 590);
						const y = g.game.random.get(60, 320);
						setMove(p.tag, x, y);
					}
				}

				if (p.isCollision && !p.isDie && g.Collision.withinAreas(p, ball, 40) && !ball.isCatch) {
					if (!ball.isMove || p.stateCatch === 1) {
						//落ちている時と掴もうとしているとき掴む
						ball.player = p;
						p.isMove = false;//止まる
						ball.catch();
						p.isCatch = true;

						cursorNext.x = cursorNow.x;
						cursorNext.y = cursorNow.y;
						cursorNext.modified();

						playSound("se_move", seVol);

					} else {
						//動いているときは当たる
						ball.moveX = -ball.moveX;
						ball.moveY = -ball.moveY;

						//エフェクト作成
						const effect = new g.FrameSprite({
							scene: scene,
							src: scene.assets["effect"] as g.ImageAsset,
							width: 120,
							height: 120,
							frames: [0, 1, 2],
							interval: 100,
							x: ball.x - 50,
							y: ball.y - 50,
							opacity: 0.5
						});
						effect.start();
						ballE.append(effect);

						ball.player.hitCnt++;

						//反動で飛ばされる
						timeline.create(p).moveBy(10 * -(ball.speed * ball.moveX), 0, 500).call(() => {
							if (g.game.selfId === key) {
								cursorNow.moveTo(p.x - 10, p.y - 8);
								cursorNow.modified();
								cursorNext.moveTo(p.x - 10, p.y - 8);
								cursorNext.modified();
							}
							p.stop();

							const px = (p.x + p.width / 2);

							if (p.life <= 0 || px < 30 || px > 610) {
								p.die();
								scene.setTimeout(() => {
									if (g.game.selfId === key) {
										cursorNow.hide();
										cursorNext.hide();
									}
									p.hide();
								}, 3000);

								labelInfo.textColor = "red";
								labelInfo.text = "OUT " + p.name;

								dieCnt++;
								if (dieCnt >= Object.keys(players).length - 1) {
									finish();
								}
							} else {
								labelInfo.textColor = "yellow";
								labelInfo.text = "HIT " + p.name;
							}
							labelInfo.invalidate();
							effect.destroy();
						});

						scene.setTimeout(() => {
							ball.stop();
						}, 200);

						p.stop();
						p.hit(ball.moveX);

						playSound("se_hit", seVol);
					}
				}

				//ボールをプレイヤーに追従
				if (p.isCatch) {
					ball.x = p.x + (p.width - ball.width) / 2 + (20 * p.direction);
					ball.y = p.y + (p.height - ball.height) / 2 + 8;
					ball.modified();
					p.time += (1 / 30);
				} else {
					p.time = 0;
				}

				//ボールを長く掴んでいる場合強制的に投げる
				if (p.time > 3) {
					throwBall(p);
				}


				if (!p.isMove || p.isDie) continue;

				//角度と速度から移動量を求めて加算
				p.speed += 0.1;
				p.y += Math.sin(p.radian) * p.speed;
				p.x += Math.cos(p.radian) * p.speed;
				p.distance -= p.speed;
				p.modified();

				if (g.game.selfId === key) {
					cursorNow.moveTo(p.x - 10, p.y - 8);
					cursorNow.modified();
				}

				//カーソル位置まできたら止まる
				if (p.distance <= 0) {
					//p.isMove = false;
					p.stop();
					//ボールを持っていたら投げる
					if (p.isCatch) {
						throwBall(p);
					}
				}

			}

			//ボールの移動
			if (ball.isMove && !ball.isCatch) {
				ball.moveBy(ball.moveX * ball.speed, ball.moveY * ball.speed);
				ball.modified();
				//画面端に当たった場合反転
				if (ball.x < 0 || ball.x > g.game.width - ball.width) {
					ball.moveX = -ball.moveX;
					ball.speed += 0.3;//加速
				}
				if (ball.y < 15 || ball.y > g.game.height - ball.height + 15) {
					ball.moveY = -ball.moveY;
					ball.speed += 0.3;
				}
			}

		});

		//移動先を設定
		const setMove = (id: string, x2: number, y2: number) => {
			if (players[id] === undefined) return;
			//角度と距離を求める
			const p = players[id];
			const x = p.x - 10;
			const y = p.y - 8;
			p.radian = Math.atan2(y2 - y, x2 - x);
			p.distance = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
			p.isMove = true;
			p.speed = 3;

			//向きを変える
			p.setAngle((x < x2) ? 1 : -1);
			p.move();
		}

		//グローバルイベント
		scene.message.add((msg) => {
			// 関係ないイベントは無視して抜ける
			if (!msg.data || !msg.data.event) return;
			const ev: { player: g.Player, point: g.CommonOffset } = msg.data.event;
			setMove(ev.player.id, ev.point.x, ev.point.y);
		});

		//キャッチできる状態にする(グローバルイベント)
		scene.message.add((msg) => {
			// 関係ないイベントは無視して抜ける
			if (!msg.data || !msg.data.msg) return;
			if (msg.data.msg === "catching") {
				const p: Player = players[msg.data.player.id];
				if (!p.isCollision || p.isCatch || p.isDie) return;
				p.catch();
			}
		});

		//移動先の指定
		localE.pointDown.add(ev => {
			const p = players[ev.player.id];
			if (!isStart || !p || !p.isCollision || p.isDie) return;

			if (ev.point.x < 50) ev.point.x = 50;
			if (ev.point.x > 630) ev.point.x = 630;
			if (ev.point.y < 60) ev.point.y = 60;
			if (ev.point.y > 350) ev.point.y = 350;

			ev.point.x = ev.point.x - 10 - 35;
			ev.point.y = ev.point.y - 32 - 25;

			//移動先カーソル位置変更
			cursorNext.x = ev.point.x;
			cursorNext.y = ev.point.y;
			cursorNext.modified();

			//グローバルイベント
			g.game.raiseEvent(new g.MessageEvent({ event: { player: ev.player, point: ev.point } }));
		});

		//掴める状態にする
		cursorNow.pointDown.add(e => {
			if (!isStart) return;

			//グローバルイベント
			g.game.raiseEvent(new g.MessageEvent({ msg: "catching", player: e.player }));
		});

		//ゲーム開始
		this.start = (users: { [key: string]: string }, life: number, time: number) => {

			timeLimit = time * 60;

			//プレイヤー生成
			for (let id in users) {
				const name = users[id];
				const src = scene.assets["player"] as g.ImageAsset;
				const player = new Player(scene, id, name, life, true, font);

				playerE.append(player);
				players[id] = player;

				ballE.append(ball);

				if (id === g.game.selfId) {
					cursorNow.x = player.x - 10;
					cursorNow.y = player.y - 8;
					cursorNow.modified();
				}
			};

			const num = Object.keys(users).length;
			if (num < 5) {
				for (let i = 0; i < 5 - num; i++) {
					const name = "bot" + (i + 1);
					const src = scene.assets["player"] as g.ImageAsset;
					const id = "" + i;
					const player = new Player(scene, id, name,life, false, font);

					playerE.append(player);
					players[id] = player;

					ballE.append(ball);
				}
			}

			isStart = true;

			playSound("se_start", seVol);
		};

	}
}
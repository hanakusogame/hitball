import { Input } from './Input';
import { Timeline } from "@akashic-extension/akashic-timeline";
import { Player } from "./player";
import { Ball } from "./Ball";
import { Ranking } from "./Ranking";

export class Game extends g.E {

	public start: (input:Input) => void;

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
			text: "",
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

		//情報表示
		const labelDefeat = new g.Label({
			scene: scene,
			font: font2,
			fontSize: 25,
			text: "",
			x: 245,
			y: 300,
			textColor: "black",
			local: true
		});
		this.append(labelDefeat);

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
		const ballE = new g.E({ scene: scene });
		this.append(ballE);
		//ボール
		const balls: Ball[] = [];

		//エフェクトを載せるエンティティ
		const effectE = new g.E({
			scene: scene
		});
		this.append(effectE);

		//エフェクト作成
		const effects: g.FrameSprite[] = [];

		for (let i = 0; i < 5; i++) {
			const effect = new g.FrameSprite({
				scene: scene,
				src: scene.assets["effect"] as g.ImageAsset,
				width: 120,
				height: 120,
				frames: [0, 1, 2],
				opacity: 0.5,
				interval: 100
			});
			effect.start();
			effect.hide();
			effects.push(effect);
			effectE.append(effect);
		}

		//ランキング
		const ranking = new Ranking(scene, font2);

		//音声再生
		const playSound = (name: string, vol: number) => {
			const audio = (scene.assets[name] as g.AudioAsset).play();
			audio.changeVolume(vol);
			return audio;
		}

		//BGMの切り替えボタン
		const bgm = playSound("bgm", 0.2);
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
				bgm._changeMuted(true);
				buttonBGM.cssColor = "gray"
			} else {
				bgm._changeMuted(false);
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
		let seVol = 1.0;
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
				seVol = 1;
				buttonSE.cssColor = "white"
			}
			buttonSE.modified();
		});

		//リセットボタン
		const btnReset = new g.Sprite({
			scene: scene,
			src: scene.assets["button"],
			x: 510,
			y: 305,
			anchorX: 0,
			anchorY: 0,
			scaleX: 0.5,
			scaleY: 0.5,
			touchable: true
		});

		const labelReset = new g.Label({
			scene: scene,
			font: font2,
			x: 20,
			y: 15,
			fontSize: 50,
			textColor: "white",
			text: "リセット"
		});
		btnReset.append(labelReset);

		btnReset.pointDown.add(() => {
			//this.destroy();
			location.reload();//ブラウザ更新
		});

		//終了処理
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
		const throwBall = (p: Player, ball: Ball) => {
			ball.isMove = true;
			ball.isCatch = false;
			ball.moveY = Math.sin(p.radian);
			ball.moveX = Math.cos(p.radian);
			ball.speed = (p.speed + 2);
			p.ball = null;

			//自分の投げたボールに当たらないように無敵時間を作る
			p.isCollision = false;
			scene.setTimeout(() => { p.isCollision = true }, 700);

			playSound("se_move", seVol * 0.5);
		};

		//ゲームループ
		this.update.add(() => {
			if (!isStart) return;

			timeLimit -= (1 / 30);
			const min = Math.floor(timeLimit / 60);
			const sec = Math.floor(timeLimit % 60);
			labelTime.text = min + ":" + ('00' + sec).slice(-2);


			playerE.children.sort((a, b) => a.y - b.y);

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
						if (balls.length != 0 && g.game.random.get(0, 3) === 0 && !balls[0].isCatch && !balls[0].isMove) {
							setMove(p.tag, balls[0].x, balls[0].y);//ボールに向かう
						} else {
							const x = g.game.random.get(50, 590);
							const y = g.game.random.get(60, 320);
							setMove(p.tag, x, y);//ランダム
						}
					}
				}

				for (let i = 0; i < balls.length; i++) {
					const ball = balls[i];
					if (p.isCollision && !p.isDie && g.Collision.withinAreas(p, ball, 40) && !ball.isCatch && ball.isCollision) {
						if (!ball.isMove || p.stateCatch === 1) {
							if (!p.ball) {
								//落ちている時と掴もうとしているとき掴む
								ball.player = p;
								p.isMove = false;//止まる
								ball.catch();
								p.ball = ball;
								p.time = 0;

								if (g.game.selfId === key) {
									cursorNext.x = cursorNow.x;
									cursorNext.y = cursorNow.y;
									cursorNext.modified();
								}

								playSound("se_move", seVol);
							}

						} else {
							//動いているときは当たる
							ball.moveX = -ball.moveX;
							ball.moveY = -ball.moveY;

							//エフェクト作成
							const effect = effects.pop();
							if (effect) {
								effect.x = ball.x - 50;
								effect.y = ball.y - 50;
								effect.modified();
								effect.show();
							}

							ball.player.hitCnt++;

							//離す処理のつもり
							if (p.ball) {
								p.ball.isCatch = false;
								p.ball.stop();
								p.ball = null;
							}

							//反動で飛ばされる
							p.isCollision = false;
							timeline.create(p).moveBy(10 * -(ball.speed * ball.moveX), 0, 500).call(() => {
								if (g.game.selfId === key) {
									cursorNow.moveTo(p.x - 10, p.y - 8);
									cursorNow.modified();
									cursorNext.moveTo(p.x - 10, p.y - 8);
									cursorNext.modified();
								}
								p.stop();
								p.isCollision = true;

								const px = (p.x + p.width / 2);

								if ((p.life <= 0 || px < 30 || px > 610) && !p.isDie) {
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

								if (effect) {
									effect.hide();
									effects.unshift(effect);
								}
							});

							scene.setTimeout(() => {
								ball.stop();
							}, 200);

							p.stop();
							p.hit(ball.moveX);

							playSound("se_hit", seVol * 0.5);
						}
					}

					//ボールをプレイヤーに追従
					if (p.ball && p.ball === ball) {
						ball.x = p.x + (p.width - ball.width) / 2 + (20 * p.direction);
						ball.y = p.y + (p.height - ball.height) / 2 + 8;
						ball.modified();
						p.time += (1 / 30);
					}

					//ボールを長く掴んでいる場合強制的に投げる
					if (p.time > 5) {
						throwBall(p, p.ball);
						p.time = 0;
						p.isMove = false;//止まる
						if (g.game.selfId === key) {
							cursorNext.x = cursorNow.x;
							cursorNext.y = cursorNow.y;
							cursorNext.modified();
						}
					}

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
					if (p.ball) {
						throwBall(p,p.ball);
					}
				}

			}

			for (let i = 0; i < balls.length; i++) {
				const ball = balls[i];
				//ボールの移動
				if (ball.isMove && !ball.isCatch) {
					ball.moveBy(ball.moveX * ball.speed, ball.moveY * ball.speed);
					ball.modified();
					//画面端に当たった場合反転
					if (ball.x < 0 && ball.moveX < 0) {
						ball.moveX = -ball.moveX;
						ball.speed += 0.5;//加速
					}
					else if (ball.x > g.game.width - ball.width && ball.moveX >= 0) {
						ball.moveX = -ball.moveX;
						ball.speed += 0.5;//加速
					}
					else if (ball.y < 15 && ball.moveY < 0) {
						ball.moveY = -ball.moveY;
						ball.speed += 0.5;
					}
					else if (ball.y > g.game.height - ball.height + 15 && ball.moveY >= 0) {
						ball.moveY = -ball.moveY;
						ball.speed += 0.5;
					}
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
				if (!p.isCollision || p.ball || p.isDie) return;
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
		this.start = (input:Input) => {

			timeLimit = input.time * 60;

			labelTime.text = input.time + ":00";
			labelTime.invalidate();

			let cnt = 0;
			const array: { id: string, name: string }[] = [];

			//配列に変換
			let ownerName = input.users[input.lastJoinPlayerId];
			for (let id in input.users) {
				if (id === input.lastJoinPlayerId) continue;
				array.push({ id: id, name: input.users[id] });
			}

			//シャッフル
			for (let i = array.length - 1; i > 0; i--) {
				let r = Math.floor(g.game.random.generate() * (i + 1));
				let tmp = array[i];
				array[i] = array[r];
				array[r] = tmp;
			}

			array.unshift({ id: input.lastJoinPlayerId, name: ownerName });
			const playerLimit = (input.limit <= 2) ? (input.limit + 2) * 10 : 1000

			//プレイヤー生成
			array.forEach(p => {
				if (cnt < playerLimit) {
					const name = p.name;
					const player = new Player(scene, p.id, name, input.life, true, font);

					playerE.append(player);
					players[p.id] = player;

					if (p.id === g.game.selfId) {
						cursorNow.x = player.x - 10;
						cursorNow.y = player.y - 8;
						cursorNow.modified();
					}
				} else {
					if (g.game.selfId == p.id) {
						labelDefeat.text = "落選しました";
						labelDefeat.invalidate();
						scene.setTimeout(() => labelDefeat.hide(), 5000);
					}
				}
				cnt++;
			});

			//ボット作成
			const num = Object.keys(input.users).length;
			if (num < 10) {
				for (let i = 0; i < 10 - num; i++) {
					const name = "bot" + (i + 1);
					const id = "" + i;
					const player = new Player(scene, id, name, input.life, false, font);
					playerE.append(player);
					players[id] = player;
				}
			}

			//ボール作成
			for (let i = 0; i < input.ballNum; i++) {
				const ball = new Ball(scene);
				balls.push(ball);
				ballE.append(balls[i]);
				balls[i].x = g.game.random.get(200, 460);
				balls[i].y = g.game.random.get(100, 200);
				balls[i].modified();

				ball.spr.y = -250;
				ball.spr.scale(1.3);
				ball.spr.modified();
				ball.spr.opacity = 0;

				timeline.create(ball.spr).scaleTo(1, 1, 2000).con().moveTo(0, -6, 2000)
					.con().every((a,b) => {
						ball.spr.opacity = b;
					}, 2000).wait(1000).call(() => {
						ball.isCollision = true;
					});
			}

			timeline.create(null).wait(1000).call(() => {
				isStart = true;
				playSound("se_start", seVol);
			});
		};

	}
}
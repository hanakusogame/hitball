import { Player } from "./player";

export class Ranking extends g.FilledRect {
	public setPlayers: (players: Player[]) => void;
	constructor(scene: g.Scene, font: g.Font) {
		super({
			scene: scene,
			width: 440,
			height: 320,
			x: 100,
			y: -1000,
			cssColor: "white"
		});

		const nameLabels: g.Label[] = [];
		const hitLabels: g.Label[] = [];
		const numLabels: g.Label[] = [];

		this.append(new g.Label({
			scene: scene,
			font: font,
			fontSize: 15,
			text: "順位",
			x: 10,
			y: 6
		}));

		this.append(new g.Label({
			scene: scene,
			font: font,
			fontSize: 15,
			text: "名前",
			x: 200,
			y: 6
		}));

		this.append(new g.Label({
			scene: scene,
			font: font,
			fontSize: 15,
			text: "当てた回数",
			x: 340,
			y: 6
		}));

		const line = new g.FilledRect({
			scene: scene,
			width: 430,
			height: 3,
			x: 5,
			y: 30,
			cssColor: "gray"
		});
		this.append(line);

		for (let i = 0; i < 5; i++) {
			let label = new g.Label({
				scene: scene,
				font: font,
				fontSize: 24,
				text: "",
				x: 10,
				y: i * 60 + 40
			});
			this.append(label);
			numLabels.push(label);

			label = new g.Label({
				scene: scene,
				font: font,
				fontSize: 24,
				text: "",
				x: 120,
				y: i * 60 + 40
			});
			this.append(label);
			nameLabels.push(label);

			label = new g.Label({
				scene: scene,
				font: font,
				fontSize: 24,
				text: "",
				x: 360,
				y: i * 60 + 40
			});
			this.append(label);
			hitLabels.push(label);
		}

		this.setPlayers = (players) => {
			//ソート
			const ps = players.sort(function (a, b) {
				return b.life - a.life || b.hitCnt - a.hitCnt;
			});

			for (let i = 0; i < 5; i++) {
				if (ps.length - 1 < i) break;

				ps[i].show();
				ps[i].x = 50;
				ps[i].y = i * 60 + 30;
				this.append(ps[i]);
				ps[i].setRanking();

				let label = numLabels[i];
				label.text = (i + 1) + ":";
				label.invalidate();

				label = nameLabels[i];
				label.text = ps[i].name;
				label.invalidate();

				label = hitLabels[i];
				label.text = "" + ps[i].hitCnt;
				label.invalidate();
			}
		}

	}
}
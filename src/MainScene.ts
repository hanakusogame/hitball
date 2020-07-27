import { Game } from './game';
import { Input } from './Input';
export class MainScene extends g.Scene {
	public reset: () => void = () => { };

	constructor(pram:g.SceneParameterObject) {
		super(pram);

		let input: Input = null;
		this.loaded.add(() => {
			const gameMain = new Game(this);
			this.append(gameMain);

			input = new Input({
				scene: this
			});

			input.endEvent = () => {
				input.hide();
				gameMain.start(input);
			};

			this.append(input);
		});

	}
}
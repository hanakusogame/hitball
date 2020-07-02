import { Input } from './Input';
import { Label } from "@akashic-extension/akashic-label";
import MultiKeyboard = require("./MultiKeyboard");
import key = require("./define");
import { Game } from './game';

const game = g.game;

function main(): void {
	const assetIds: string[] = [];
	const consonants: string[] = ["", "k", "s", "t", "n", "h", "m", "r"];
	consonants.forEach((v) => {
		assetIds.push(
			v + "a",
			v + "i",
			v + "u",
			v + "e",
			v + "o"
		);
	});
	for (let i = 0; i < key.alpha.length; i++) {
		assetIds.push("a_" + key.alpha[i]);
	}
	for (let i = 0; i < 10; i++) {
		assetIds.push("d_" + i);
	}
	for (let i = 0; i < 20; i++) {
		assetIds.push("sym_" + i);
	}
	assetIds.push(
		"ya",
		"yu",
		"yo",
		"wa",
		"wo",
		"nn",
		"small",
		"voiced",
		"semiVoiced",
		"toKanaLetters",
		"toAlphaLetters",
		"toSymLetters",
		"inputtingLabelBack",
		"backSpaceKey",
		"open",
		"close",
		"notosansFont",
		"notosansGlyph",
		"ball",
		"cursor",
		"button",
		"court",
		"player_body",
		"player_head",
		"effect",
		"bgm",
		"se_move",
		"se_hit",
		"se_start",
		"se_timeup"
	);

	const scene = new g.Scene({ game, assetIds });

	scene.loaded.add(() => {

		const game = new Game({
			scene: scene
		});
		scene.append(game);

		const input = new Input({
			scene: scene
		});

		input.endEvent = () => {
			input.hide();
			game.start(input.users);
		};

		scene.append(input);

	});
	g.game.pushScene(scene);

}

export = main;

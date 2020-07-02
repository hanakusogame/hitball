import Keyboard = require("./Keyboard");
import KeyboardParameterObject = require("./KeyboardParameterObject");
import def = require("./define");

/**
 * ひらがな、英数字、記号対応キーボード。
 * ひらがなだけ扱いたい場合は `Keyboard` クラスを利用する。
 * 本クラスの利用にはアセットID, g.Fontが必要となる。
 */
class MultiKeyboard extends Keyboard {
	/**
	 * アルファベット用入力キーのグループ。
	 */
	private alphaKey: g.E;

	/**
	 * 記号用入力キーのグループ。
	 */
	private symKey: g.E;

	/**
	 * キーボード変更キー群
	 */
	private convKana: g.Pane;
	private convAlpha: g.Pane;
	private convSym: g.Pane;

	/**
	 * 各種パラメータを指定して `MultiKeyboard` のインスタンスを生成する。
	 * @param param このエンティティに対するパラメータ
	 */
	constructor(param: KeyboardParameterObject) {
		super(param);

		this.alphaKey = new g.E({
			scene: this.scene,
			width: g.game.width,
			height: g.game.height,
			hidden: true
		});
		this.append(this.alphaKey);

		this.symKey = new g.E({
			scene: this.scene,
			width: g.game.width,
			height: g.game.height,
			hidden: true
		});
		this.append(this.symKey);

		for (let i = 0; i < def.alpha.length; i++) {
			const char = def.alpha[i];
			const alphaAsset = (this.scene.assets["a_" + char] as g.ImageAsset);
			const key = new g.Pane({
				scene: this.scene,
				width: alphaAsset.width,
				height: alphaAsset.height,
				x: def.alphaX[i],
				y: def.alphaY[i],
				backgroundImage: alphaAsset,
				touchable: true,
				local:true
			});
			key.pointDown.add(() => {
				if (this.inputtingLabel.text.length < this.maxLength) {
					this.inputtingLabel.text += def.alpha[i];
					this.inputtingLabel.invalidate();
				}
			});
			this.alphaKey.append(key);
		}

		for (let i = 0; i < def.digit.length; i++) {
			const char = def.digit[i];
			const digitAsset = this.scene.assets["d_" + ((i + 1) % 10)] as g.ImageAsset;
			const key = new g.Pane({
				scene: this.scene,
				width: digitAsset.width,
				height: digitAsset.height,
				x: def.symX[i],
				y: def.symY[0],
				backgroundImage: digitAsset,
				touchable: true,
				local:true
			});
			key.pointDown.add(() => {
				if (this.inputtingLabel.text.length < this.maxLength) {
					this.inputtingLabel.text += char;
					this.inputtingLabel.invalidate();
				}
			});
			this.symKey.append(key);
		}

		for (let i = 0; i < def.symbol.length; i++) {
			const char = def.symbol[i];
			const SymAsset = this.scene.assets["sym_" + i] as g.ImageAsset;
			const key = new g.Pane({
				scene: this.scene,
				width: SymAsset.width,
				height: SymAsset.height,
				x: def.symX[i],
				y: def.symY[Math.floor(i / 10) + 1],
				backgroundImage: SymAsset,
				touchable: true,
				local:true
			});
			key.pointDown.add(() => {
				if (this.inputtingLabel.text.length < this.maxLength) {
					this.inputtingLabel.text += char;
					this.inputtingLabel.invalidate();
				}
			});
			this.symKey.append(key);
		}

		const convKanaAsset = this.scene.assets["toKanaLetters"] as g.ImageAsset;
		this.convKana = new g.Pane({
			scene: this.scene,
			width: convKanaAsset.width,
			height: convKanaAsset.height,
			x: def.convX[0],
			y: def.convY,
			backgroundImage: convKanaAsset,
			touchable: true,
			local:true,
			hidden: true
		});
		this.convKana.pointDown.add(() => {
			this.alphaKey.hide();
			this.symKey.hide();
			this.kanaKey.show();

			this.convAlpha.x = def.convX[0];
			this.convAlpha.modified();

			this.convKana.hide();
			this.convAlpha.show();
			this.convSym.show();
		});
		this.common.append(this.convKana);

		const convAlphaAsset = this.scene.assets["toAlphaLetters"] as g.ImageAsset;
		this.convAlpha = new g.Pane({
			scene: this.scene,
			width: convAlphaAsset.width,
			height: convAlphaAsset.height,
			x: def.convX[0],
			y: def.convY,
			backgroundImage: convAlphaAsset,
			touchable: true,
			local:true
		});
		this.convAlpha.pointDown.add(() => {
			this.kanaKey.hide();
			this.symKey.hide();
			this.alphaKey.show();

			this.convAlpha.hide();
			this.convKana.show();
			this.convSym.show();
		});
		this.common.append(this.convAlpha);

		const convSymAsset = this.scene.assets["toSymLetters"] as g.ImageAsset;
		this.convSym = new g.Pane({
			scene: this.scene,
			width: convSymAsset.width,
			height: convSymAsset.height,
			x: def.convX[1],
			y: def.convY,
			backgroundImage: convSymAsset,
			touchable: true,
			local:true
		});
		this.convSym.pointDown.add(() => {
			this.kanaKey.hide();
			this.alphaKey.hide();
			this.symKey.show();

			this.convAlpha.x = def.convX[1];
			this.convAlpha.modified();

			this.convSym.hide();
			this.convKana.show();
			this.convAlpha.show();
		});
		this.common.append(this.convSym);
	}

	destroy(): void {
		super.destroy();
		this.alphaKey.destroy();
		this.alphaKey = null!;
		this.symKey.destroy();
		this.symKey = null!;
		this.convKana.destroy();
		this.convKana = null!;
		this.convAlpha.destroy();
		this.convAlpha = null!;
		this.convSym.destroy();
		this.convSym = null!;
	}
}

export = MultiKeyboard;

import { Label } from "@akashic-extension/akashic-label";
import KeyboardParameterObject = require("./KeyboardParameterObject");
import def = require("./define");

/**
 * ひらがな限定キーボード。
 * 英数字、記号も扱いたい場合は `MultiKeyboard` クラスを利用する。
 * 本クラスの利用にはアセットID, g.Fontが必要となる。
 */
class Keyboard extends g.E {
	/**
	 * 描画に利用されるフォント。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	font: g.Font;

	/**
	 * 描画に利用されるフォントのサイズ。
	 * 省略時は `72` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	fontSize: number;

	/**
	 * 文字列の描画色をCSS Color形式で指定する。
	 * 元の描画色に重ねて表示されるため、アルファ値を指定した場合は元の描画色が透けて表示される。
	 * 初期値は `undefined` となり、 描画色の変更を行わない。
	 * 省略時は `#575757` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	textColor: string;

	/**
	 * キーボード背景色。
	 * 必ず透過度が `80%` となる。
	 * 変更したい場合は、`Keyboard` クラスの `keyboardBack`のプロパティ変更が必要。
	 * 省略時は `#252525` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	backgroundColor: string;

	/**
	 * 入力文字数の最大値。
	 * 省略時は `15` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	maxLength: number;

	/**
	 * キーボードで利用する素材のアセットID
	 */
	protected sceneAssets: {[key: string]: g.Asset};

	protected common: g.E;
	protected kanaKey: g.E;
	protected keyboardBack: g.FilledRect;
	protected inputtingLabelBack: g.Pane;
	protected inputtingLabel: Label;
	protected backSpaceKey: g.Pane;

	/**
	 * 各種パラメータを指定して `Keyboard` のインスタンスを生成する。
	 * @param param このエンティティに対するパラメータ
	 */
	constructor(param: KeyboardParameterObject) {
		super(param);
		this.font = param.font;
		this.fontSize = "fontSize" in param ? param.fontSize : 72;
		this.textColor = "textColor" in param ? param.textColor : "#575757";
		this.backgroundColor = "backgroundColor" in param ? param.backgroundColor : "#252525";
		this.maxLength = "maxLength" in param ? param.maxLength : 15;
		this.sceneAssets = param.sceneAssets;

		this.common = new g.E({
			scene: this.scene,
			width: 1280,
			height: 720
		});
		this.append(this.common);

		this.kanaKey = new g.E({
			scene: this.scene,
			width: 1280,
			height: 720
		});
		this.append(this.kanaKey);

		this.keyboardBack = new g.FilledRect({
			scene: this.scene,
			cssColor: this.backgroundColor,
			width: 1280,
			height: 720,
			opacity: 0.8
		});
		this.common.append(this.keyboardBack);

		const inputtingLabelBackAsset = (this.sceneAssets["inputtingLabelBack"] as g.ImageAsset);
		this.inputtingLabelBack = new g.Pane({
			scene: this.scene,
			width: inputtingLabelBackAsset.width,
			height: inputtingLabelBackAsset.height,
			x: 8,
			y: 80,
			backgroundImage: inputtingLabelBackAsset
		});

		this.inputtingLabel = new Label({
			scene: this.scene,
			font: this.font,
			fontSize: this.fontSize,
			text: "",
			textColor: this.textColor,
			width: this.inputtingLabelBack.width - 20 * 2,
			height: this.fontSize,
			x: 20,
			y: this.inputtingLabelBack.height / 2,
			anchorX: 0.0,
			anchorY: 0.5
		});
		this.inputtingLabelBack.append(this.inputtingLabel);
		this.common.append(this.inputtingLabelBack);

		for (let i = 0; i < def.hiragana.length; i++) {
			const char = def.hiragana[i];
			const kanaAsset = (this.sceneAssets[def.toRoman[char]] as g.ImageAsset);
			const key = new g.Pane({
				scene: this.scene,
				width: kanaAsset.width,
				height: kanaAsset.height,
				x: def.kanaX[i],
				y: def.kanaY[i],
				backgroundImage: kanaAsset,
				touchable: true,
				local: true
			});
			key.pointDown.add(() => {
				if (this.inputtingLabel.text.length < this.maxLength) {
					this.inputtingLabel.text += char;
					this.inputtingLabel.invalidate();
				}
			});
			this.kanaKey.append(key);
		}

		const smallKeyAsset = (this.sceneAssets["small"] as g.ImageAsset);
		const smallKey = new g.Pane({
			scene: this.scene,
			width: smallKeyAsset.width,
			height: smallKeyAsset.height,
			x: def.smallX,
			y: def.smallY,
			backgroundImage: smallKeyAsset,
			touchable: true
		});
		smallKey.pointDown.add(() => {
			/**
			 * 入力文字列語尾が小文字にすることが可能であれば小文字へ変換する。
			 * 入力文字列語尾が小文字であればもとの文字へ変換する。
			 */
			if (this.inputtingLabel.text.length <= 0) return;
			const moji = this.inputtingLabel.text.slice(-1);
			const idx = def.canSmall.indexOf(moji);
			const ridx = def.smallChar.indexOf(moji);
			if (idx !== -1 || ridx !== -1) {
				this.inputtingLabel.text = this.inputtingLabel.text.slice(0, -1);
				this.inputtingLabel.text += (idx !== -1) ? def.smallChar[idx] : def.canSmall[ridx];
				this.inputtingLabel.invalidate();
			}
		});
		this.kanaKey.append(smallKey);

		const voicedKeyAsset = (this.sceneAssets["voiced"] as g.ImageAsset);
		const voicedKey = new g.Pane({
			scene: this.scene,
			width: voicedKeyAsset.width,
			height: voicedKeyAsset.height,
			x: def.voicedX,
			y: def.voicedY,
			backgroundImage: voicedKeyAsset,
			touchable: true,
			local:true
		});
		voicedKey.pointDown.add(() => {
			/**
			 * 入力文字列語尾に濁点を付けることが可能であれば濁点を付ける。
			 * 入力文字列語尾が濁点付きであればもとの文字へ変換する。
			 */
			if (this.inputtingLabel.text.length <= 0) return;
			const moji = this.inputtingLabel.text.slice(-1);
			const idx = def.canVoiced.indexOf(moji);
			const ridx = def.voicedChar.indexOf(moji);
			const cidx = def.semiVoicedChar.indexOf(moji);
			if (idx !== -1 || ridx !== -1 || cidx !== -1) {
				this.inputtingLabel.text = this.inputtingLabel.text.slice(0, -1);
				this.inputtingLabel.text += (idx !== -1) ? def.voicedChar[idx]
											: (ridx !== -1) ? def.canVoiced[ridx]
											: def.bChar[cidx];
				this.inputtingLabel.invalidate();
			}
		});
		this.kanaKey.append(voicedKey);

		const semiVoicedKeyAsset = (this.sceneAssets["semiVoiced"] as g.ImageAsset);
		const semiVoicedKey = new g.Pane({
			scene: this.scene,
			width: semiVoicedKeyAsset.width,
			height: semiVoicedKeyAsset.height,
			x: def.semiVoicedX,
			y: def.semiVoicedY,
			backgroundImage: semiVoicedKeyAsset,
			touchable: true
		});
		semiVoicedKey.pointDown.add(() => {
			/**
			 * 入力文字列語尾に半濁点を付けることが可能であれば半濁点を付ける。
			 * 入力文字列語尾が半濁点付きであればもとの文字へ変換する。
			 */
			if (this.inputtingLabel.text.length <= 0 ) return;
			const moji = this.inputtingLabel.text.slice(-1);
			const idx = def.canSemiVoiced.indexOf(moji);
			const ridx = def.semiVoicedChar.indexOf(moji);
			const pidx = def.bChar.indexOf(moji);

			if (idx !== -1 || ridx !== -1 || pidx !== -1) {
				this.inputtingLabel.text = this.inputtingLabel.text.slice(0, -1);
				this.inputtingLabel.text += (idx !== -1) ? def.semiVoicedChar[idx]
											: (ridx !== -1) ? def.canSemiVoiced[ridx]
											: def.semiVoicedChar[pidx];
				this.inputtingLabel.invalidate();
			}
		});
		this.kanaKey.append(semiVoicedKey);

		//削除ボタン
		const backSpaceKeyAsset = (this.sceneAssets["backSpaceKey"] as g.ImageAsset);
		this.backSpaceKey = new g.Pane({
			scene: this.scene,
			width: backSpaceKeyAsset.width,
			height: backSpaceKeyAsset.height,
			x: 1280 - 28 - backSpaceKeyAsset.width,
			y: this.inputtingLabelBack.y + (this.inputtingLabelBack.height - backSpaceKeyAsset.height) / 2,
			backgroundImage: backSpaceKeyAsset,
			touchable: true,
			local:true
		});

		this.backSpaceKey.pointDown.add(() => {
			if (this.inputtingLabel.text.length > 0) {
				this.inputtingLabel.text = this.inputtingLabel.text.slice(0, -1);
				this.inputtingLabel.invalidate();
			}
		});
		this.common.append(this.backSpaceKey);
	}

	invalidate(): void {
		super.modified();
		this.inputtingLabel.font = this.font;
		this.inputtingLabel.fontSize = this.fontSize;
		this.inputtingLabel.height = this.fontSize;
		this.inputtingLabel.textColor = this.textColor;
		this.inputtingLabel.text = this.inputtingLabel.text.slice(0, this.maxLength);
		this.inputtingLabel.invalidate();
		this.keyboardBack.cssColor = this.backgroundColor;
		this.keyboardBack.modified();
	}

	destroy(): void {
		super.destroy();
		this.common.destroy();
		this.common = null!;
		this.kanaKey.destroy();
		this.kanaKey = null!;
		this.keyboardBack.destroy();
		this.keyboardBack = null!;
		this.inputtingLabelBack.destroy();
		this.inputtingLabelBack = null!;
		this.inputtingLabel.destroy();
		this.inputtingLabel = null!;
		this.backSpaceKey.destroy();
		this.backSpaceKey = null!;
	}

	get text(): string {
		return this.inputtingLabel.text;
	}

	set text(text: string) {
		this.inputtingLabel.text = text.slice(0, Math.min(this.maxLength, text.length));
		this.inputtingLabel.invalidate();
	}
}

export = Keyboard;

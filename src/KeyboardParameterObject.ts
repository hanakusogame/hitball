interface KeyboardParameterObject extends g.EParameterObject {
	/**
	 * キーボードで利用する素材のアセットID
	 */
	sceneAssets: {[key: string]: g.Asset};

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
	fontSize?: number;

	/**
	 * 文字列の描画色をCSS Color形式で指定する。
	 * 元の描画色に重ねて表示されるため、アルファ値を指定した場合は元の描画色が透けて表示される。
	 * 初期値は `undefined` となり、 描画色の変更を行わない。
	 * 省略時は `#575757` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	textColor?: string;

	/**
	 * キーボード背景色。
	 * 必ず透過度が `80%` となる。
	 * 変更したい場合は、`Keyboard` クラスの `keyboardBack`のプロパティ変更が必要。
	 * 省略時は `#252525` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	backgroundColor?: string;

	/**
	 * 入力文字数の最大値。
	 * 省略時は `15` となる。
	 * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
	 */
	maxLength?: number;
}

export = KeyboardParameterObject;

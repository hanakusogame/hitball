# akashic-software-keyboard-sample
かな限定キーボード `Keyboard` 、かな英記対応キーボード `MultiKeyboard` のサンプル。  
操作性の問題から、画面解像度 **1280 × 720** で利用することを前提にキーボードが作られています。  

![keyboard_sample](./image/keyboard_sample.gif)

## ビルド方法
`npm run build` によりビルドできます。

```sh
npm install
npm run build
```

## キーボード素材について
以下のように各素材のアセットIDが指定されていることを前提として動作します。  
アセットIDを変更する場合は、`Keyboard` , `MultiKeyboard` クラスの定義を適宜変更してください。  
※印が付いている素材は `MultiKeyboard` クラスを利用する際に必要になります。  

|  種類  |  アセットID  |  備考  |  
| -- | -- | -- |
|  入力中テキストの背景素材  |  `inputtingLabelBack`  |      | 
|  ローマ字  |  対応するひらがなのローマ字  |  「は」->「ha」<br>「ん」->「nn」  | 
|  濁点  |  `voiced`  |      | 
|  半濁点  |  `semiVoiced`  |      | 
|  小文字  |  `small`  |      | 
|  バックスペースキー  |  `backSpaceKey`  |      | 
|  アルファベット **※**  |  `a_{アルファベット}`  |   `MultiKeyboard`を利用する場合。<br>「a」->「a_a」<br>「z」->「a_z」    | 
|  記号 **※**  |  数字 -> `_{数字}`<br> 記号 -> `sym_{記号インデックス}`   |    `MultiKeyboard`を利用する場合。<br> 各記号インデックスに対応する記号は以下に従う。左から0-indexedで指定<br> `'，．・？！＝～ー（）「」＜＞＆＃＄％★` <br>計20個| 
|  キーボード変更キー **※**  |  ひらがなキーボード変更キー -> `toKanaLetters`<br> アルファベットキーボード変更キー -> `toAlphaLetters`<br> 記号キーボード変更キー -> `toSymLetters` |    `MultiKeyboard`を利用する場合。   | 

## キーボードパラメータ
`src/KeyboardParameterObject` を参照してください。

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](./LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
/**
 * 利用するひらがな
 */
export const hiragana: string = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
/**
 * 利用する数字
 */
export const digit: string = "1234567890";
/**
 * 利用するアルファベット
 */
export const alpha: string = "abcdefghijklmnopqrstuvwxyz";
/**
 * 利用する記号
 */
export const symbol: string = "'，．・？！＝～ー（）「」＜＞＆＃＄％★";
/**
 * 濁点を付けることが可能なひらがな
 */
export const canVoiced: string = "かきくけこさしすせそたちつてとはひふへほ";
/**
 * 半濁点を付けることが可能なひらがな
 */
export const canSemiVoiced: string = "はひふへほ";
/**
 * 小文字にすることが可能なひらがな
 */
export const canSmall: string = "あいうえおつやゆよわ";
/**
 * 濁点付きひらがな
 */
export const voicedChar: string = "がぎぐげござじずぜぞだぢづでどばびぶべぼ";
/**
 * 半濁点付きひらがな
 */
export const semiVoicedChar: string = "ぱぴぷぺぽ";
/**
 * 小文字ひらがな
 */
export const smallChar: string = "ぁぃぅぇぉっゃゅょゎ";
/**
 * ばびぶべぼ
 */
export const bChar: string = "ばびぶべぼ";

/**
 * ひらがなローマ字変換
 */
export const toRoman: { [key: string]: string } = {
	あ: "a",
	い: "i",
	う: "u",
	え: "e",
	お: "o",
	か: "ka",
	き: "ki",
	く: "ku",
	け: "ke",
	こ: "ko",
	さ: "sa",
	し: "si",
	す: "su",
	せ: "se",
	そ: "so",
	た: "ta",
	ち: "ti",
	つ: "tu",
	て: "te",
	と: "to",
	な: "na",
	に: "ni",
	ぬ: "nu",
	ね: "ne",
	の: "no",
	は: "ha",
	ひ: "hi",
	ふ: "hu",
	へ: "he",
	ほ: "ho",
	ま: "ma",
	み: "mi",
	む: "mu",
	め: "me",
	も: "mo",
	や: "ya",
	ゆ: "yu",
	よ: "yo",
	ら: "ra",
	り: "ri",
	る: "ru",
	れ: "re",
	ろ: "ro",
	わ: "wa",
	を: "wo",
	ん: "nn"
};

/**
 * ひらがなキー座標
 */
export const kanaX = [
	8, 88, 168, 248, 328, 444, 524, 604, 684, 764, 880, 960, 1040, 1120, 1200,
	8, 88, 168, 248, 328, 444, 524, 604, 684, 764, 880, 960, 1040, 1120, 1200,
	8, 88, 168, 248, 328, 444, 580, 716, 880, 960, 1040, 1120, 1200,
	8, 144, 280
];
export const kanaY = [
	216, 216, 216, 216, 216, 216, 216, 216, 216, 216, 216, 216, 216, 216, 216,
	312, 312, 312, 312, 312, 312, 312, 312, 312, 312, 312, 312, 312, 312, 312,
	408, 408, 408, 408, 408, 408, 408, 408, 408, 408, 408, 408, 408,
	504, 504, 504
];

/**
 * 「小」「゛」「゜」キー座標
 */
export const smallX = 444;
export const smallY = 504;
export const voicedX = 580;
export const voicedY = 504;
export const semiVoicedX = 716;
export const semiVoicedY = 504;

/**
 * アルファベットキー座標
 */
export const alphaX = [
	8, 167, 326, 485, 645, 804, 963, 1122,
	8, 167, 326, 485, 645, 804, 963, 1122,
	8, 167, 326, 485, 645, 804, 963, 1122,
	8, 167
];
export const alphaY = [
	216, 216, 216, 216, 216, 216, 216, 216,
	312, 312, 312, 312, 312, 312, 312, 312,
	408, 408, 408, 408, 408, 408, 408, 408,
	504, 504
];

/**
 * 記号キー座標
 */
export const symX = [
	8, 136, 264, 393, 521, 649, 777, 906, 1034, 1162,
	8, 136, 264, 393, 521, 649, 777, 906, 1034, 1162
];
export const symY = [216, 309, 402];

/**
 * キーボード変更キー座標
 */
export const convX = [880, 1092];
export const convY = 504;

import { SurveyAnswers } from "@/types/survey";

export interface RecommendationCategory {
  label: string;
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
}

const BUDGET_RANGE: Record<string, { min?: number; max?: number }> = {
  "〜3,000円": { max: 3500 },
  "3,000〜5,000円": { min: 2500, max: 5500 },
  "5,000〜10,000円": { min: 4500, max: 11000 },
  "10,000円以上": { min: 9000 },
};

// 肌タイプ × 悩みの組み合わせキーワード（2〜3語に絞る）
function skinKeyword(skinType: string, concern: string): string {
  const map: Record<string, Record<string, string>> = {
    乾燥肌: {
      ニキビ:    "乾燥肌 ニキビケア",
      シミ:     "保湿 美白化粧水",
      毛穴:     "乾燥肌 毛穴ケア",
      乾燥:     "セラミド 保湿化粧水",
      シワ:     "乾燥肌 エイジングケア",
      くすみ:   "保湿 トーンアップ",
      赤み:     "乾燥肌 低刺激化粧水",
    },
    脂性肌: {
      ニキビ:    "ニキビケア オイルフリー",
      シミ:     "美白化粧水 さっぱり",
      毛穴:     "毛穴ケア 皮脂",
      乾燥:     "脂性肌 保湿化粧水",
      シワ:     "脂性肌 エイジングケア",
      くすみ:   "角質ケア 化粧水",
      赤み:     "鎮静 スキンケア",
    },
    混合肌: {
      ニキビ:    "ニキビ 化粧水",
      シミ:     "美白 化粧水",
      毛穴:     "毛穴 化粧水",
      乾燥:     "混合肌 保湿",
      シワ:     "エイジングケア 美容液",
      くすみ:   "トーンアップ 化粧水",
      赤み:     "低刺激 化粧水",
    },
    敏感肌: {
      ニキビ:    "敏感肌 ニキビ",
      シミ:     "敏感肌 美白",
      毛穴:     "敏感肌 毛穴",
      乾燥:     "敏感肌 セラミド",
      シワ:     "敏感肌 エイジングケア",
      くすみ:   "敏感肌 トーンアップ",
      赤み:     "敏感肌 鎮静",
    },
    普通肌: {
      ニキビ:    "ニキビ予防 化粧水",
      シミ:     "美白 化粧水",
      毛穴:     "毛穴 化粧水",
      乾燥:     "保湿 化粧水",
      シワ:     "エイジングケア 美容液",
      くすみ:   "くすみ 化粧水",
      赤み:     "赤み 鎮静",
    },
  };

  return map[skinType]?.[concern] ?? `${concern} スキンケア`;
}

const MAKEUP_CONCERN_KEYWORDS: Record<string, string> = {
  メイク崩れ:         "崩れにくい ファンデーション",
  発色が悪い:         "発色 チーク コスメ",
  "カバー力が足りない": "高カバー ファンデーション",
  "毛穴が隠れない":    "毛穴 化粧下地",
  乾燥する:           "保湿 ファンデーション",
  テカリやすい:        "テカリ防止 フェイスパウダー",
};

const HAIR_CONCERN_KEYWORDS: Record<string, string> = {
  パサつき:    "ヘアオイル トリートメント",
  うねり:      "くせ毛 ヘアケア",
  広がり:      "まとまり ヘアミルク",
  ボリューム不足: "ボリュームアップ シャンプー",
  ダメージ:    "ダメージ補修 トリートメント",
  頭皮の乾燥:  "スカルプ シャンプー",
};

// 肌タイプだけの場合の汎用キーワード
const SKIN_TYPE_FALLBACK: Record<string, string> = {
  乾燥肌: "乾燥肌 化粧水",
  脂性肌: "脂性肌 化粧水",
  混合肌: "混合肌 スキンケア",
  敏感肌: "敏感肌 化粧水",
  普通肌: "保湿 化粧水",
};

export function buildRecommendations(answers: SurveyAnswers): RecommendationCategory[] {
  const budget = typeof answers.q2 === "string" ? answers.q2 : undefined;
  const priceRange = budget ? BUDGET_RANGE[budget] ?? {} : {};
  const skinType = typeof answers.q1 === "string" ? answers.q1 : "普通肌";

  const skinConcerns = Array.isArray(answers.q3)
    ? answers.q3.filter((c) => c !== "特にない")
    : [];
  const makeupConcerns = Array.isArray(answers.q5)
    ? answers.q5.filter((c) => c !== "特にない")
    : [];
  const hairConcerns = Array.isArray(answers.q6)
    ? answers.q6.filter((c) => c !== "特にない")
    : [];

  const categories: RecommendationCategory[] = [];

  // スキンケア
  if (skinConcerns.length > 0) {
    skinConcerns.slice(0, 2).forEach((concern) => {
      categories.push({
        label: `${skinType}向け ${concern}ケアアイテム`,
        keyword: skinKeyword(skinType, concern),
        ...priceRange,
      });
    });
  } else {
    categories.push({
      label: `${skinType}向けスキンケア`,
      keyword: SKIN_TYPE_FALLBACK[skinType] ?? "保湿 化粧水",
      ...priceRange,
    });
  }

  // メイク
  makeupConcerns.slice(0, 2).forEach((concern) => {
    categories.push({
      label: `メイク・${concern}対策`,
      keyword: MAKEUP_CONCERN_KEYWORDS[concern] ?? "ベースメイク コスメ",
      ...priceRange,
    });
  });

  // ヘアケア
  hairConcerns.slice(0, 2).forEach((concern) => {
    categories.push({
      label: `ヘアケア・${concern}対策`,
      keyword: HAIR_CONCERN_KEYWORDS[concern] ?? "ヘアケア トリートメント",
      ...priceRange,
    });
  });

  return categories;
}

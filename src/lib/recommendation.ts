import { SurveyAnswers } from "@/types/survey";

export interface RecommendationCategory {
  label: string;
  keyword: string;
  minPrice?: number;
  maxPrice?: number;
}

const BUDGET_RANGE: Record<string, { min?: number; max?: number }> = {
  "〜3,000円": { max: 3000 },
  "3,000〜5,000円": { min: 3000, max: 5000 },
  "5,000〜10,000円": { min: 5000, max: 10000 },
  "10,000円以上": { min: 10000 },
};

const SKIN_CONCERN_KEYWORDS: Record<string, string> = {
  ニキビ: "ニキビ スキンケア",
  シミ: "美白 スキンケア シミ",
  毛穴: "毛穴 化粧水 スキンケア",
  乾燥: "保湿 化粧水 乾燥肌",
  シワ: "エイジングケア 美容液 シワ",
  くすみ: "くすみ ケア 化粧水",
  赤み: "敏感肌 スキンケア 赤み",
};

const SKIN_TYPE_KEYWORDS: Record<string, string> = {
  乾燥肌: "乾燥肌 保湿 スキンケア",
  脂性肌: "脂性肌 オイルコントロール スキンケア",
  混合肌: "混合肌 スキンケア",
  普通肌: "スキンケア 化粧水 保湿",
  敏感肌: "敏感肌 スキンケア 低刺激",
};

const MAKEUP_CONCERN_KEYWORDS: Record<string, string> = {
  メイク崩れ: "崩れにくい ファンデーション",
  発色が悪い: "発色 リップ チーク コスメ",
  "カバー力が足りない": "高カバー ファンデーション コンシーラー",
  "毛穴が隠れない": "毛穴カバー ファンデーション プライマー",
  乾燥する: "保湿 ファンデーション 乾燥肌 メイク",
  テカリやすい: "テカリ防止 パウダー コントロール",
};

const HAIR_CONCERN_KEYWORDS: Record<string, string> = {
  パサつき: "パサつき ヘアオイル 保湿 トリートメント",
  うねり: "うねり くせ毛 ヘアケア",
  広がり: "広がり 抑える ヘアミルク",
  ボリューム不足: "ボリュームアップ ヘアケア スタイリング",
  ダメージ: "ダメージ補修 トリートメント",
  頭皮の乾燥: "頭皮 保湿 スカルプシャンプー",
};

export function buildRecommendations(answers: SurveyAnswers): RecommendationCategory[] {
  const budget = typeof answers.q2 === "string" ? answers.q2 : undefined;
  const priceRange = budget ? BUDGET_RANGE[budget] : {};

  const categories: RecommendationCategory[] = [];

  // スキンケア（肌質 + 肌の悩みから最優先のキーワードを生成）
  const skinType = typeof answers.q1 === "string" ? answers.q1 : "";
  const skinConcerns = Array.isArray(answers.q3)
    ? answers.q3.filter((c) => c !== "特にない")
    : [];

  if (skinConcerns.length > 0) {
    const topConcern = skinConcerns[0];
    const keyword =
      SKIN_CONCERN_KEYWORDS[topConcern] ??
      SKIN_TYPE_KEYWORDS[skinType] ??
      "スキンケア 保湿";
    categories.push({
      label: `スキンケア（${topConcern}ケア）`,
      keyword,
      ...priceRange,
    });

    if (skinConcerns.length > 1) {
      const secondConcern = skinConcerns[1];
      categories.push({
        label: `スキンケア（${secondConcern}ケア）`,
        keyword: SKIN_CONCERN_KEYWORDS[secondConcern] ?? keyword,
        ...priceRange,
      });
    }
  } else {
    categories.push({
      label: `${skinType || ""}向けスキンケア`,
      keyword: SKIN_TYPE_KEYWORDS[skinType] ?? "スキンケア 保湿",
      ...priceRange,
    });
  }

  // メイク
  const makeupConcerns = Array.isArray(answers.q5)
    ? answers.q5.filter((c) => c !== "特にない")
    : [];
  if (makeupConcerns.length > 0) {
    const topMakeup = makeupConcerns[0];
    categories.push({
      label: `メイク（${topMakeup}対策）`,
      keyword: MAKEUP_CONCERN_KEYWORDS[topMakeup] ?? "コスメ ベースメイク",
      ...priceRange,
    });
  }

  // ヘアケア
  const hairConcerns = Array.isArray(answers.q6)
    ? answers.q6.filter((c) => c !== "特にない")
    : [];
  if (hairConcerns.length > 0) {
    const topHair = hairConcerns[0];
    categories.push({
      label: `ヘアケア（${topHair}対策）`,
      keyword: HAIR_CONCERN_KEYWORDS[topHair] ?? "ヘアケア トリートメント",
      ...priceRange,
    });
  }

  return categories;
}

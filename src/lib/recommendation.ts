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

// 肌タイプ × 悩みの組み合わせで最適なキーワードを生成
function skinKeyword(skinType: string, concern: string): string {
  const map: Record<string, Record<string, string>> = {
    乾燥肌: {
      ニキビ: "乾燥肌 ニキビ 保湿 スキンケア",
      シミ: "乾燥肌 美白 保湿 化粧水",
      毛穴: "乾燥肌 毛穴 保湿 化粧水",
      乾燥: "乾燥肌 セラミド 保湿 化粧水",
      シワ: "乾燥肌 エイジングケア 保湿 美容液",
      くすみ: "乾燥肌 くすみ 美白 保湿",
      赤み: "乾燥肌 敏感肌 低刺激 保湿",
    },
    脂性肌: {
      ニキビ: "脂性肌 ニキビ オイルフリー スキンケア",
      シミ: "脂性肌 美白 さっぱり 化粧水",
      毛穴: "脂性肌 毛穴 皮脂 ケア",
      乾燥: "脂性肌 インナードライ 保湿 さっぱり",
      シワ: "脂性肌 エイジングケア ジェル 美容液",
      くすみ: "脂性肌 くすみ 角質ケア 化粧水",
      赤み: "脂性肌 赤み 鎮静 スキンケア",
    },
    混合肌: {
      ニキビ: "混合肌 ニキビ 皮脂 バランス スキンケア",
      シミ: "混合肌 美白 化粧水",
      毛穴: "混合肌 毛穴 Tゾーン ケア",
      乾燥: "混合肌 保湿 バランス 化粧水",
      シワ: "混合肌 エイジングケア 美容液",
      くすみ: "混合肌 くすみ トーンアップ 化粧水",
      赤み: "混合肌 赤み 低刺激 スキンケア",
    },
    敏感肌: {
      ニキビ: "敏感肌 ニキビ 低刺激 スキンケア",
      シミ: "敏感肌 美白 低刺激 化粧水",
      毛穴: "敏感肌 毛穴 低刺激 ケア",
      乾燥: "敏感肌 保湿 セラミド 低刺激",
      シワ: "敏感肌 エイジングケア 低刺激 美容液",
      くすみ: "敏感肌 くすみ 低刺激 化粧水",
      赤み: "敏感肌 赤み 鎮静 セラミド",
    },
    普通肌: {
      ニキビ: "ニキビ 予防 スキンケア",
      シミ: "美白 化粧水 スキンケア",
      毛穴: "毛穴 化粧水 ケア",
      乾燥: "保湿 化粧水 スキンケア",
      シワ: "エイジングケア 美容液",
      くすみ: "くすみ トーンアップ 化粧水",
      赤み: "赤み 鎮静 スキンケア",
    },
  };

  return (
    map[skinType]?.[concern] ??
    `${skinType} ${concern} スキンケア`
  );
}

const MAKEUP_CONCERN_KEYWORDS: Record<string, string> = {
  メイク崩れ: "崩れにくい ファンデーション 化粧直し",
  発色が悪い: "発色 リップ チーク コスメ",
  "カバー力が足りない": "高カバー ファンデーション コンシーラー",
  "毛穴が隠れない": "毛穴カバー プライマー ファンデーション",
  乾燥する: "保湿 ファンデーション 乾燥肌 メイク",
  テカリやすい: "テカリ防止 フィックスパウダー コントロール",
};

const HAIR_CONCERN_KEYWORDS: Record<string, string> = {
  パサつき: "パサつき ヘアオイル 保湿 トリートメント",
  うねり: "うねり くせ毛 ヘアケア ストレート",
  広がり: "広がり 抑える ヘアミルク まとまり",
  ボリューム不足: "ボリュームアップ ヘアケア スタイリング",
  ダメージ: "ダメージ補修 トリートメント ヘアマスク",
  頭皮の乾燥: "頭皮 保湿 スカルプ シャンプー",
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

  // スキンケア：上位2悩み × 肌タイプで精度高いキーワード
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
      keyword: `${skinType} 保湿 スキンケア おすすめ`,
      ...priceRange,
    });
  }

  // メイク：上位2悩み
  makeupConcerns.slice(0, 2).forEach((concern) => {
    categories.push({
      label: `メイク・${concern}対策`,
      keyword: MAKEUP_CONCERN_KEYWORDS[concern] ?? "コスメ ベースメイク",
      ...priceRange,
    });
  });

  // ヘアケア：上位2悩み
  hairConcerns.slice(0, 2).forEach((concern) => {
    categories.push({
      label: `ヘアケア・${concern}対策`,
      keyword: HAIR_CONCERN_KEYWORDS[concern] ?? "ヘアケア トリートメント",
      ...priceRange,
    });
  });

  return categories;
}

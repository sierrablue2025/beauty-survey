import { SurveyAnswers } from "@/types/survey";

export interface SkinDiagnosis {
  skinTypeLabel: string;
  skinTypeSummary: string;
  ageGroup: string;
  ageAdvice: string;
  concerns: string[];
  routineAdvice: string[];
  ingredientTips: string[];
  careLevel: "basic" | "intensive";
}

const SKIN_TYPE_INFO: Record<string, { summary: string; routine: string[] }> = {
  乾燥肌: {
    summary:
      "水分・油分ともに不足しやすい肌質です。バリア機能が低下しやすく、外部刺激を受けやすい傾向があります。しっかり保湿することが最優先です。",
    routine: [
      "洗顔後すぐに化粧水をなじませる（時間を置かない）",
      "化粧水→美容液→乳液またはクリームの順でしっかり重ねる",
      "洗顔料はしっとりタイプかミルク洗顔を選ぶ",
    ],
  },
  脂性肌: {
    summary:
      "皮脂の分泌が多く、テカリやベタつきが気になりやすい肌質です。毛穴の詰まりやニキビにもなりやすいですが、保湿は欠かせません。",
    routine: [
      "オイルフリー・ノンコメドジェニックのアイテムを選ぶ",
      "化粧水はさっぱりタイプ、乳液は薄め〜省いてもOK",
      "週1〜2回の角質ケアでざらつきを予防する",
    ],
  },
  混合肌: {
    summary:
      "Tゾーンは脂っぽく、頬や目元は乾燥しやすいタイプです。部位ごとにケアを変えると効果的です。",
    routine: [
      "Tゾーンにはさっぱりタイプ、Uゾーンにはしっとりタイプを使い分ける",
      "化粧水はさっぱり〜普通タイプを全体に、クリームは乾燥部分だけに",
      "洗顔のしすぎに注意し、優しく洗う",
    ],
  },
  普通肌: {
    summary:
      "水分・油分バランスが整った肌質です。現状を維持するための基礎ケアを続けることが大切です。",
    routine: [
      "化粧水・乳液の基本2ステップを丁寧に続ける",
      "紫外線対策でコンディションを保つ",
      "季節の変わり目に保湿量を調整する",
    ],
  },
  敏感肌: {
    summary:
      "外部刺激に反応しやすく、赤みやかゆみが出やすい肌質です。シンプルなケアと低刺激アイテム選びが重要です。",
    routine: [
      "成分がシンプルなアイテム（無香料・無着色・アルコールフリー）を選ぶ",
      "新しいアイテムは腕の内側でパッチテストをしてから使う",
      "こすらず、やさしく押さえるようにスキンケアする",
    ],
  },
};

const AGE_ADVICE: Record<string, { advice: string; ingredients: string }> = {
  "10代": {
    advice: "皮脂分泌が活発な時期です。洗顔と保湿の基本を丁寧に行うことが大切。ニキビができやすい場合は低刺激のアイテムを選びましょう。",
    ingredients: "グリセリン・ヒアルロン酸・グリチルリチン酸2K",
  },
  "20代": {
    advice: "肌のターンオーバーが整っている時期ですが、紫外線ダメージが蓄積し始めます。今から始める日焼け止めと保湿が将来の肌を守ります。",
    ingredients: "ビタミンC誘導体・ヒアルロン酸・ナイアシンアミド",
  },
  "30代": {
    advice: "コラーゲン生成が減少し始め、ほうれい線や毛穴の開きが気になる時期です。保湿に加えてエイジングケア成分を取り入れましょう。",
    ingredients: "レチノール・ペプチド・セラミド・ナイアシンアミド",
  },
  "40代": {
    advice: "ホルモンバランスの変化で肌の乾燥やたるみが出やすくなります。油分を補うリッチなテクスチャーのアイテムが効果的です。",
    ingredients: "レチノール・コラーゲン・フラーレン・セラミド",
  },
  "50代以上": {
    advice: "肌のバリア機能が低下し、乾燥・くすみ・たるみが顕著になる時期です。保湿とハリケアを軸に、やさしいケアを継続しましょう。",
    ingredients: "セラミド・コエンザイムQ10・レチノール・ペプチド",
  },
};

const CONCERN_ADVICE: Record<string, { advice: string; ingredient: string }> = {
  ニキビ: {
    advice: "過剰な皮脂と毛穴の詰まりが原因のことが多いです。保湿をしながら皮脂バランスを整えることが大切です。",
    ingredient: "ナイアシンアミド・サリチル酸・グリチルリチン酸2K",
  },
  シミ: {
    advice: "メラニンの生成を抑えるケアと紫外線対策を組み合わせることが効果的です。朝のUVケアは必須です。",
    ingredient: "ビタミンC誘導体・トラネキサム酸・アルブチン",
  },
  毛穴: {
    advice: "皮脂詰まりによる黒ずみ、たるみによる開き、どちらのタイプかで対策が変わります。保湿で肌のハリを保つことも重要です。",
    ingredient: "レチノール・ナイアシンアミド・BHA（サリチル酸）",
  },
  乾燥: {
    advice: "インナードライの可能性もあります。洗顔のしすぎを避け、こまめな保湿を心がけてください。",
    ingredient: "ヒアルロン酸・セラミド・グリセリン",
  },
  シワ: {
    advice: "紫外線ダメージの蓄積が主な原因です。エイジングケア成分と紫外線対策を日常に取り入れましょう。",
    ingredient: "レチノール・ペプチド・コラーゲン・ナイアシンアミド",
  },
  くすみ: {
    advice: "古い角質の蓄積や血行不良が原因のことが多いです。角質ケアと保湿を組み合わせると透明感が出やすいです。",
    ingredient: "ビタミンC誘導体・AHA（乳酸・グリコール酸）・コウジ酸",
  },
  赤み: {
    advice: "バリア機能の低下や炎症が原因です。刺激の少ないアイテムで肌を落ち着かせることを優先してください。",
    ingredient: "グリチルリチン酸2K・セラミド・アラントイン",
  },
};

export function buildDiagnosis(answers: SurveyAnswers): SkinDiagnosis {
  const skinType = typeof answers.q1 === "string" ? answers.q1 : "普通肌";
  const ageGroup = typeof answers.q_age === "string" ? answers.q_age : "20代";
  const skinConcerns = Array.isArray(answers.q3)
    ? answers.q3.filter((c) => c !== "特にない")
    : [];
  const severity = typeof answers.q4 === "string" ? answers.q4 : "";

  const typeInfo = SKIN_TYPE_INFO[skinType] ?? SKIN_TYPE_INFO["普通肌"];
  const ageInfo = AGE_ADVICE[ageGroup] ?? AGE_ADVICE["20代"];

  const concernAdvice = skinConcerns
    .slice(0, 3)
    .map((c) => CONCERN_ADVICE[c]?.advice)
    .filter(Boolean) as string[];

  const ingredientTips = [
    `【${ageGroup}におすすめ】${ageInfo.ingredients}`,
    ...skinConcerns.slice(0, 2).map((c) => {
      const ing = CONCERN_ADVICE[c]?.ingredient;
      return ing ? `【${c}】${ing}` : null;
    }).filter(Boolean) as string[],
  ];

  const careLevel: "basic" | "intensive" =
    severity === "とても気になる" || skinConcerns.length >= 3
      ? "intensive"
      : "basic";

  return {
    skinTypeLabel: skinType,
    skinTypeSummary: typeInfo.summary,
    ageGroup,
    ageAdvice: ageInfo.advice,
    concerns: skinConcerns,
    routineAdvice: [...typeInfo.routine, ...concernAdvice],
    ingredientTips,
    careLevel,
  };
}

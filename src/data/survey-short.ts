import { SurveyDefinition } from "@/types/survey";

export const surveyShort: SurveyDefinition = {
  title: "美容かんたん診断",
  description:
    "6つの質問に答えるだけで、あなたに合いそうな美容アイテムのご提案に役立てます。",
  questions: [
    {
      id: "q1",
      label: "あなたの肌質を教えてください",
      type: "single",
      required: true,
      description: "いちばん近いものを1つ選んでください。",
      options: ["乾燥肌", "脂性肌", "混合肌", "普通肌", "敏感肌"],
    },
    {
      id: "q2",
      label: "1ヶ月の美容予算はどのくらいですか？",
      type: "single",
      required: true,
      description: "だいたいの目安で大丈夫です。",
      options: ["〜3,000円", "3,000〜5,000円", "5,000〜10,000円", "10,000円以上"],
    },
    {
      id: "q3",
      label: "肌で気になることを教えてください",
      type: "multiple",
      required: true,
      description: "あてはまるものをすべて選んでください。",
      options: ["ニキビ", "シミ", "毛穴", "乾燥", "シワ", "くすみ", "赤み", "特にない"],
      exclusiveOptions: ["特にない"],
    },
    {
      id: "q4",
      label: "メイクや髪で気になることはありますか？",
      type: "multiple",
      required: false,
      description: "あてはまるものをすべて選んでください。",
      options: [
        "メイク崩れ",
        "カバー力不足",
        "乾燥する",
        "テカリ",
        "パサつき",
        "うねり",
        "ダメージ",
        "特にない",
      ],
      exclusiveOptions: ["特にない"],
    },
    {
      id: "q5",
      label: "化粧品を選ぶとき、何を重視しますか？",
      type: "multiple",
      required: true,
      description: "あてはまるものをすべて選んでください。",
      options: ["価格", "成分", "ブランド", "口コミ", "パッケージ", "香り"],
    },
    {
      id: "q6",
      label: "化粧品はどこで購入することが多いですか？",
      type: "single",
      required: true,
      description: "もっとも近いものを1つ選んでください。",
      options: ["ドラッグストア", "百貨店", "ネット通販", "SNS紹介", "美容クリニック"],
    },
  ],
};

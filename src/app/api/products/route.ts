import { NextRequest, NextResponse } from "next/server";
import { searchRakutenItems } from "@/lib/rakuten-api";
import { buildRecommendations } from "@/lib/recommendation";
import { buildDiagnosis } from "@/lib/diagnosis";
import { SurveyAnswers } from "@/types/survey";

function buildReason(category: string, answers: SurveyAnswers): string {
  const skinType = typeof answers.q1 === "string" ? answers.q1 : "";
  const concerns = Array.isArray(answers.q3) ? answers.q3.filter((c) => c !== "特にない") : [];
  if (category.includes("スキンケア")) return `${skinType}で${concerns[0] || ""}が気になるあなたに`;
  if (category.includes("メイク")) return `メイクの${concerns[0] || ""}が気になるあなたに`;
  if (category.includes("ヘアケア")) return `髪の悩みがあるあなたに`;
  return `${skinType}のあなたに`;
}

const SORT_MAP: Record<string, string> = {
  reviewCount: "-reviewCount",
  price_asc: "+itemPrice",
  price_desc: "-itemPrice",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: SurveyAnswers = body.answers ?? body;
    const sortKey: string = body.sort ?? "reviewCount";
    const rakutenSort = SORT_MAP[sortKey] ?? "-reviewCount";

    const categories = buildRecommendations(answers);
    const diagnosis = buildDiagnosis(answers);

    const results = await Promise.all(
      categories.map(async (cat) => {
        const items = await searchRakutenItems({
          keyword: cat.keyword,
          hits: 4,
          minPrice: cat.minPrice,
          maxPrice: cat.maxPrice,
          sort: rakutenSort,
        });
        return { category: cat.label, items, reason: buildReason(cat.label, answers) };
      })
    );

    return NextResponse.json({ diagnosis, results });
  } catch (err) {
    console.error("[/api/products]", err);
    return NextResponse.json({ error: "商品の取得に失敗しました" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchRakutenItems } from "@/lib/rakuten-api";
import { buildRecommendations } from "@/lib/recommendation";
import { buildDiagnosis } from "@/lib/diagnosis";
import { SurveyAnswers } from "@/types/survey";

export async function POST(req: NextRequest) {
  try {
    const answers: SurveyAnswers = await req.json();
    const categories = buildRecommendations(answers);
    const diagnosis = buildDiagnosis(answers);

    const results = await Promise.all(
      categories.map(async (cat) => {
        const items = await searchRakutenItems({
          keyword: cat.keyword,
          hits: 4,
          minPrice: cat.minPrice,
          maxPrice: cat.maxPrice,
        });
        return { category: cat.label, items };
      })
    );

    return NextResponse.json({ diagnosis, results });
  } catch (err) {
    console.error("[/api/products]", err);
    return NextResponse.json({ error: "商品の取得に失敗しました" }, { status: 500 });
  }
}

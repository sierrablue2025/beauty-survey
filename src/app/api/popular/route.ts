import { NextResponse } from "next/server";
import { searchRakutenItems } from "@/lib/rakuten-api";

const POPULAR_CATEGORIES = [
  { label: "人気の化粧水", keyword: "化粧水 保湿" },
  { label: "人気の美容液", keyword: "美容液 エイジングケア" },
  { label: "人気の日焼け止め", keyword: "日焼け止め 顔用" },
];

export async function GET() {
  try {
    const results: { category: string; items: Awaited<ReturnType<typeof searchRakutenItems>> }[] = [];
    for (const cat of POPULAR_CATEGORIES) {
      try {
        const items = await searchRakutenItems({
          keyword: cat.keyword,
          hits: 4,
          sort: "-reviewCount",
        });
        results.push({ category: cat.label, items });
      } catch {
        results.push({ category: cat.label, items: [] });
      }
    }
    return NextResponse.json({ results }, { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" } });
  } catch (err) {
    console.error("[/api/popular]", err);
    return NextResponse.json({ error: "人気商品の取得に失敗しました" }, { status: 500 });
  }
}

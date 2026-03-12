"use client";

import { useEffect, useState } from "react";
import { SurveyAnswers } from "@/types/survey";
import { RakutenItem } from "@/lib/rakuten-api";
import { SkinDiagnosis } from "@/lib/diagnosis";
import { ProductCard } from "./ProductCard";
import { SkeletonCard, SkeletonDiagnosis } from "./SkeletonCard";
import { ShareButtons } from "./ShareButtons";

interface ProductCategory {
  category: string;
  items: RakutenItem[];
  reason?: string;
}

interface ResultsViewProps {
  answers: SurveyAnswers;
  onReset: () => void;
}

type SortOption = "reviewCount" | "price_asc" | "price_desc";

function AmazonSearchLink({ keyword }: { keyword: string }) {
  const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;
  const url = `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}${tag ? `&tag=${tag}` : ""}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6763] border border-[#E7DED8] rounded-full px-3 py-1.5 hover:bg-[#FAF8F6] transition-colors mt-1"
    >
      <span>Amazonでも探す →</span>
    </a>
  );
}

export function ResultsView({ answers, onReset }: ResultsViewProps) {
  const [diagnosis, setDiagnosis] = useState<SkinDiagnosis | null>(null);
  const [results, setResults] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortOption>("reviewCount");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, sort }),
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (!cancelled) {
          setDiagnosis(data.diagnosis ?? null);
          setResults(data.results ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("商品の取得に失敗しました。しばらくしてからお試しください。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [answers, sort, retryCount]);

  return (
    <div>
      {/* ヘッダー */}
      <div className="bg-white rounded-3xl border border-[#E7DED8] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-4 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-[22px] font-bold text-[#3E3A39] mb-2">あなたの診断結果</h2>
        <p className="text-[14px] text-[#6E6763]">
          回答内容をもとに、肌タイプの分析とおすすめアイテムをご提案します。
        </p>
      </div>

      {/* スケルトン */}
      {loading && (
        <>
          <SkeletonDiagnosis />
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </>
      )}

      {error && (
        <div className="bg-white rounded-2xl border border-[#E7DED8] p-6 text-center">
          <p className="text-[14px] text-[#C65B5B] mb-3">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((c) => c + 1)}
            className="h-10 px-6 rounded-full bg-[#D8B4A0] text-white text-[14px] font-semibold hover:bg-[#C89A82] transition-colors"
          >
            再試行する
          </button>
        </div>
      )}

      {!loading && !error && diagnosis && (
        <>
          {/* 肌タイプ診断カード */}
          <div className="bg-white rounded-3xl border border-[#E7DED8] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-semibold text-[#D8B4A0] tracking-widest uppercase">
                肌タイプ診断
              </span>
              {diagnosis.careLevel === "intensive" && (
                <span className="text-[11px] bg-[#EBDDD6] text-[#C89A82] font-semibold px-2 py-0.5 rounded-full">
                  集中ケア推奨
                </span>
              )}
            </div>
            <h3 className="text-[20px] font-bold text-[#3E3A39] mb-2">
              <span className="text-[#C89A82]">{diagnosis.ageGroup}</span>・<span className="text-[#C89A82]">{diagnosis.skinTypeLabel}</span> タイプ
            </h3>
            <p className="text-[14px] text-[#6E6763] leading-relaxed mb-2">
              {diagnosis.skinTypeSummary}
            </p>
            <div className="bg-[#FDF6F2] border border-[#EBDDD6] rounded-2xl px-4 py-3 mb-4">
              <p className="text-[12px] font-semibold text-[#C89A82] mb-1">{diagnosis.ageGroup}の肌について</p>
              <p className="text-[13px] text-[#6E6763] leading-relaxed">{diagnosis.ageAdvice}</p>
            </div>

            {diagnosis.concerns.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {diagnosis.concerns.map((c) => (
                  <span
                    key={c}
                    className="text-[13px] bg-[#FAF8F6] border border-[#E7DED8] text-[#3E3A39] px-3 py-1 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-[#FAF8F6] rounded-2xl p-4 mb-4">
              <p className="text-[13px] font-semibold text-[#3E3A39] mb-2">おすすめのケア習慣</p>
              <ul className="flex flex-col gap-2">
                {diagnosis.routineAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#6E6763]">
                    <span className="text-[#D8B4A0] mt-0.5 flex-shrink-0">✓</span>
                    {advice}
                  </li>
                ))}
              </ul>
            </div>

            {diagnosis.ingredientTips.length > 0 && (
              <div className="mb-4">
                <p className="text-[13px] font-semibold text-[#3E3A39] mb-2">注目したい成分</p>
                <ul className="flex flex-col gap-1">
                  {diagnosis.ingredientTips.map((tip, i) => (
                    <li key={i} className="text-[13px] text-[#6E6763]">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 食事・栄養アドバイス */}
            {diagnosis.nutritionAdvice.length > 0 && (
              <div className="mb-2">
                <p className="text-[13px] font-semibold text-[#3E3A39] mb-2">
                  積極的に摂りたい栄養素
                </p>
                <div className="flex flex-col gap-2">
                  {diagnosis.nutritionAdvice.map((n, i) => (
                    <div key={i} className="bg-[#FAF8F6] rounded-2xl p-3 border border-[#E7DED8]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#D8B4A0]">🌿</span>
                        <span className="text-[13px] font-semibold text-[#3E3A39]">{n.nutrient}</span>
                      </div>
                      <p className="text-[12px] text-[#6E6763] mb-1">{n.reason}</p>
                      <p className="text-[12px] text-[#C89A82] font-medium">食材：{n.foods}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* おすすめ商品へスクロールボタン */}
            <button
              type="button"
              onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full mt-2 h-10 rounded-full border border-[#D8B4A0] text-[#D8B4A0] text-[14px] font-semibold hover:bg-[#FAF8F6] transition-colors"
            >
              おすすめ商品を見る ↓
            </button>
          </div>

          {/* SNSシェア */}
          <ShareButtons skinType={diagnosis.skinTypeLabel} />

          {/* おすすめ商品 */}
          <div id="products-section" className="mb-2">
            <h3 className="text-[16px] font-bold text-[#3E3A39] px-1 mb-1">
              あなたへのおすすめアイテム
            </h3>
            <p className="text-[13px] text-[#6E6763] px-1 mb-3">
              診断結果をもとに楽天から厳選しました
            </p>
            {/* 並び替えボタン */}
            <div className="flex gap-2 mb-4 px-1">
              {(["reviewCount", "price_asc", "price_desc"] as SortOption[]).map((opt) => {
                const labels: Record<SortOption, string> = {
                  reviewCount: "レビュー順",
                  price_asc: "価格が安い順",
                  price_desc: "価格が高い順",
                };
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSort(opt)}
                    className={[
                      "flex-1 h-9 rounded-full text-[12px] font-semibold border transition-colors",
                      sort === opt
                        ? "bg-[#D8B4A0] text-white border-[#D8B4A0]"
                        : "bg-white text-[#6E6763] border-[#E7DED8] hover:border-[#D8B4A0]",
                    ].join(" ")}
                  >
                    {labels[opt]}
                  </button>
                );
              })}
            </div>
          </div>

          {results.map((cat) => (
            <div key={cat.category} className="mb-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-[15px] font-semibold text-[#3E3A39] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8B4A0] inline-block" />
                  {cat.category}
                </h4>
                <AmazonSearchLink keyword={cat.category.replace(/[（）・対策向け]/g, " ")} />
              </div>
              {cat.items.length === 0 ? (
                <p className="text-[14px] text-[#6E6763] px-1">該当商品が見つかりませんでした。</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {cat.items.map((item, i) => (
                    <ProductCard key={i} item={item} reason={cat.reason} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="mt-4 mb-8">
        <button
          type="button"
          onClick={onReset}
          className="w-full h-[52px] rounded-full border border-[#D8B4A0] text-[#D8B4A0] text-[16px] font-semibold hover:bg-[#FAF8F6] transition-colors focus:outline-none"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { SurveyAnswers } from "@/types/survey";
import { RakutenItem } from "@/lib/rakuten-api";
import { SkinDiagnosis } from "@/lib/diagnosis";
import { ProductCard } from "./ProductCard";

interface ProductCategory {
  category: string;
  items: RakutenItem[];
}

interface ResultsViewProps {
  answers: SurveyAnswers;
  onReset: () => void;
}

export function ResultsView({ answers, onReset }: ResultsViewProps) {
  const [diagnosis, setDiagnosis] = useState<SkinDiagnosis | null>(null);
  const [results, setResults] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setDiagnosis(data.diagnosis ?? null);
        setResults(data.results ?? []);
      } catch {
        setError("商品の取得に失敗しました。しばらくしてからお試しください。");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [answers]);

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

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-[#D8B4A0] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[14px] text-[#6E6763]">診断中…</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-2xl border border-[#E7DED8] p-6 text-center">
          <p className="text-[14px] text-[#C65B5B]">{error}</p>
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
              あなたは <span className="text-[#C89A82]">{diagnosis.skinTypeLabel}</span> です
            </h3>
            <p className="text-[14px] text-[#6E6763] leading-relaxed mb-4">
              {diagnosis.skinTypeSummary}
            </p>

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

            {/* おすすめルーティン */}
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

            {/* 注目成分 */}
            {diagnosis.ingredientTips.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[#3E3A39] mb-2">注目したい成分</p>
                <ul className="flex flex-col gap-1">
                  {diagnosis.ingredientTips.map((tip, i) => (
                    <li key={i} className="text-[13px] text-[#6E6763]">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* おすすめ商品 */}
          <div className="mb-2">
            <h3 className="text-[16px] font-bold text-[#3E3A39] px-1 mb-1">あなたへのおすすめアイテム</h3>
            <p className="text-[13px] text-[#6E6763] px-1 mb-4">
              診断結果をもとに楽天から厳選しました
            </p>
          </div>

          {results.map((cat) => (
            <div key={cat.category} className="mb-8">
              <h4 className="text-[15px] font-semibold text-[#3E3A39] mb-3 px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8B4A0] inline-block" />
                {cat.category}
              </h4>
              {cat.items.length === 0 ? (
                <p className="text-[14px] text-[#6E6763] px-1">該当商品が見つかりませんでした。</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {cat.items.map((item, i) => (
                    <ProductCard key={i} item={item} />
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

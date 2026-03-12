"use client";

import { useEffect, useState } from "react";
import { SurveyAnswers } from "@/types/survey";
import { RakutenItem } from "@/lib/rakuten-api";
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
      <div className="bg-white rounded-3xl border border-[#E7DED8] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-6 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-[22px] font-bold text-[#3E3A39] mb-2">
          あなたへのおすすめ
        </h2>
        <p className="text-[14px] text-[#6E6763]">
          回答内容をもとに、ぴったりの美容アイテムを楽天から選びました。
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-[#D8B4A0] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-[14px] text-[#6E6763]">商品を検索しています…</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-2xl border border-[#E7DED8] p-6 text-center">
          <p className="text-[14px] text-[#C65B5B]">{error}</p>
        </div>
      )}

      {!loading && !error && results.map((cat) => (
        <div key={cat.category} className="mb-8">
          <h3 className="text-[16px] font-bold text-[#3E3A39] mb-3 px-1">
            {cat.category}
          </h3>
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

      <div className="mt-4">
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

"use client";

interface CompletionViewProps {
  onViewResults: () => void;
  onReset: () => void;
}

export function CompletionView({ onViewResults, onReset }: CompletionViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E7DED8] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-center">
      <div className="text-5xl mb-4">✨</div>
      <h2 className="text-[24px] font-bold text-[#3E3A39] mb-3">
        ご回答ありがとうございました
      </h2>
      <p className="text-[14px] text-[#6E6763] mb-8 leading-relaxed">
        回答内容をもとに、あなたに合いそうな<br />
        美容アイテムをご提案します。
      </p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onViewResults}
          className="w-full h-[52px] rounded-full bg-[#D8B4A0] text-white text-[16px] font-semibold hover:bg-[#C89A82] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A82]"
        >
          おすすめ商品を見る
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full h-[52px] rounded-full border border-[#D8B4A0] text-[#D8B4A0] text-[16px] font-semibold hover:bg-[#FAF8F6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B4A0]"
        >
          もう一度回答する
        </button>
      </div>
    </div>
  );
}

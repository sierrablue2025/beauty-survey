"use client";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function NavigationButtons({ onBack, onNext, isFirst, isLast }: NavigationButtonsProps) {
  return (
    <div className="flex gap-3 mt-6">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-[56px] rounded-full border border-[#D8B4A0] text-[#D8B4A0] text-[16px] font-semibold transition-colors hover:bg-[#FAF8F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B4A0]"
        >
          戻る
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className={[
          "h-[56px] rounded-full bg-[#D8B4A0] text-white text-[16px] font-semibold transition-colors",
          "hover:bg-[#C89A82] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89A82]",
          isFirst ? "w-full" : "flex-[2]",
        ].join(" ")}
      >
        {isLast ? "回答を完了する" : "次へ"}
      </button>
    </div>
  );
}

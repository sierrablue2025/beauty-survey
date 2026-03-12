"use client";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  exclusive?: boolean;
  onClick: () => void;
}

export function OptionButton({ label, selected, exclusive = false, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full min-h-[56px] px-4 py-4 rounded-2xl border text-left text-[16px] font-medium transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B4A0] focus-visible:ring-offset-1",
        selected
          ? "bg-[#F5EDE8] border-[#D8B4A0] text-[#3E3A39]"
          : exclusive
          ? "bg-white border-[#E7DED8] text-[#6E6763] hover:border-[#D8B4A0] hover:bg-[#FAF8F6]"
          : "bg-white border-[#E7DED8] text-[#3E3A39] hover:border-[#D8B4A0] hover:bg-[#FAF8F6]",
      ].join(" ")}
      aria-pressed={selected}
    >
      <span className="flex items-center gap-3">
        <span
          className={[
            "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
            selected ? "border-[#D8B4A0] bg-[#D8B4A0]" : "border-[#D8B4A0]",
          ].join(" ")}
        >
          {selected && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </span>
        {label}
        {exclusive && (
          <span className="ml-auto text-[12px] text-[#6E6763]">他と同時選択不可</span>
        )}
      </span>
    </button>
  );
}

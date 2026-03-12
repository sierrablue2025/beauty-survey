"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[12px] font-semibold text-[#6E6763]">
          {current} / {total}
        </span>
        <span className="text-[12px] text-[#6E6763]">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-[#EBDDD6] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D8B4A0] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

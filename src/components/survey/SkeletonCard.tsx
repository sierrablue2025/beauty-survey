export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E7DED8] overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-[#EBDDD6]" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-[#EBDDD6] rounded-full w-1/2" />
        <div className="h-4 bg-[#EBDDD6] rounded-full w-full" />
        <div className="h-4 bg-[#EBDDD6] rounded-full w-3/4" />
        <div className="h-8 bg-[#EBDDD6] rounded-full w-full mt-1" />
      </div>
    </div>
  );
}

export function SkeletonDiagnosis() {
  return (
    <div className="bg-white rounded-3xl border border-[#E7DED8] p-6 mb-4 animate-pulse">
      <div className="h-3 bg-[#EBDDD6] rounded-full w-24 mb-3" />
      <div className="h-6 bg-[#EBDDD6] rounded-full w-48 mb-2" />
      <div className="h-4 bg-[#EBDDD6] rounded-full w-full mb-1" />
      <div className="h-4 bg-[#EBDDD6] rounded-full w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-16 bg-[#EBDDD6] rounded-full" />
        ))}
      </div>
      <div className="bg-[#FAF8F6] rounded-2xl p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-[#EBDDD6] rounded-full w-full mb-2 last:mb-0" />
        ))}
      </div>
    </div>
  );
}

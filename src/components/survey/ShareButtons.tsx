"use client";

import { useState } from "react";

interface ShareButtonsProps {
  skinType: string;
}

export function ShareButtons({ skinType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://beauty-survey.vercel.app";

  const message = `私の肌診断結果は「${skinType}」でした！あなたも診断してみて✨ #美容診断 #スキンケア`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(siteUrl)}`;
  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`${message}\n${siteUrl}`)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${message}\n${siteUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7DED8] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-4">
      <p className="text-[14px] font-semibold text-[#3E3A39] mb-3 text-center">
        診断結果をシェアする
      </p>
      <div className="flex gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[44px] rounded-full bg-black text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span>𝕏</span>
          <span>でシェア</span>
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[44px] rounded-full bg-[#06C755] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span>LINE</span>
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 h-[44px] rounded-full border border-[#E7DED8] text-[#6E6763] text-[14px] font-semibold hover:bg-[#FAF8F6] transition-colors"
        >
          {copied ? "コピー完了!" : "リンクコピー"}
        </button>
      </div>
    </div>
  );
}

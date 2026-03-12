"use client";

import { Question, AnswerValue } from "@/types/survey";
import { QuestionRenderer } from "./QuestionRenderer";

interface QuestionCardProps {
  question: Question;
  index: number;
  answer: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
  visible: boolean;
}

export function QuestionCard({ question, index, answer, onChange, error, visible }: QuestionCardProps) {
  return (
    <div
      className={[
        "bg-white rounded-3xl border border-[#E7DED8] p-6 transition-all duration-200",
        "shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none absolute",
      ].join(" ")}
    >
      <div className="mb-4">
        <span className="text-[12px] font-semibold text-[#D8B4A0] tracking-wider uppercase mb-1 block">
          Q{index + 1}
          {question.required && (
            <span className="ml-2 text-[11px] text-[#6E6763] font-normal normal-case tracking-normal">
              必須
            </span>
          )}
        </span>
        <h2 className="text-[22px] font-bold text-[#3E3A39] leading-snug mb-1">
          {question.label}
        </h2>
        {question.description && (
          <p className="text-[14px] text-[#6E6763]">{question.description}</p>
        )}
      </div>
      <QuestionRenderer
        question={question}
        answer={answer}
        onChange={onChange}
        error={error}
      />
    </div>
  );
}

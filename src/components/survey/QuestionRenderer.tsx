"use client";

import { Question, AnswerValue } from "@/types/survey";
import { toggleMultipleOption } from "@/lib/survey-utils";
import { OptionButton } from "./OptionButton";

interface QuestionRendererProps {
  question: Question;
  answer: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
}

export function QuestionRenderer({ question, answer, onChange, error }: QuestionRendererProps) {
  if (question.type === "single") {
    const selected = typeof answer === "string" ? answer : "";
    return (
      <div className="flex flex-col gap-3">
        {question.options?.map((option) => (
          <OptionButton
            key={option}
            label={option}
            selected={selected === option}
            onClick={() => onChange(option)}
          />
        ))}
        {error && <p className="text-[#C65B5B] text-[13px] mt-1">{error}</p>}
      </div>
    );
  }

  if (question.type === "multiple") {
    const selected: string[] = Array.isArray(answer) ? answer : [];
    return (
      <div className="flex flex-col gap-3">
        {question.options?.map((option) => {
          const isExclusive = question.exclusiveOptions?.includes(option) ?? false;
          return (
            <OptionButton
              key={option}
              label={option}
              selected={selected.includes(option)}
              exclusive={isExclusive}
              onClick={() => {
                const next = toggleMultipleOption(selected, option, question.exclusiveOptions);
                onChange(next);
              }}
            />
          );
        })}
        {error && <p className="text-[#C65B5B] text-[13px] mt-1">{error}</p>}
      </div>
    );
  }

  if (question.type === "text") {
    const value = typeof answer === "string" ? answer : "";
    return (
      <div>
        <textarea
          className={[
            "w-full min-h-[120px] px-4 py-[14px] rounded-2xl border text-[16px] text-[#3E3A39]",
            "placeholder:text-[#B8ABA6] resize-vertical focus:outline-none focus:border-[#D8B4A0] transition-colors",
            error ? "border-[#C65B5B]" : "border-[#E7DED8]",
          ].join(" ")}
          placeholder={question.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <p className="text-[#C65B5B] text-[13px] mt-1">{error}</p>}
      </div>
    );
  }

  return null;
}

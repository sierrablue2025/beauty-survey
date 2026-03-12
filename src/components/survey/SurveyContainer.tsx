"use client";

import { useState, useCallback, useEffect } from "react";
import { SurveyDefinition, SurveyAnswers, AnswerValue } from "@/types/survey";
import { getVisibleQuestions, validateAnswer } from "@/lib/survey-utils";
import { SurveyHeader } from "./SurveyHeader";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { NavigationButtons } from "./NavigationButtons";
import { CompletionView } from "./CompletionView";
import { ResultsView } from "./ResultsView";

interface SurveyContainerProps {
  survey: SurveyDefinition;
}

export function SurveyContainer({ survey }: SurveyContainerProps) {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animating, setAnimating] = useState(false);

  const visibleQuestions = getVisibleQuestions(survey.questions, answers);
  const currentQuestion = visibleQuestions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === visibleQuestions.length - 1;

  // スクロールを上部に戻す
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  }, []);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;

    const answer = answers[currentQuestion.id] ?? null;
    const validation = validateAnswer(currentQuestion, answer);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: validation.error ?? "入力してください",
      }));
      return;
    }

    if (isLast) {
      // 送信処理（将来的にSupabaseやAPIに差し替え）
      const submissionData = {
        surveyTitle: survey.title,
        submittedAt: new Date().toISOString(),
        answers: Object.fromEntries(
          visibleQuestions.map((q) => [
            q.id,
            {
              label: q.label,
              value: answers[q.id] ?? null,
            },
          ])
        ),
      };
      console.log("[Survey] 送信データ:", JSON.stringify(submissionData, null, 2));
      setCompleted(true);
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnimating(false);
    }, 50);
  }, [currentQuestion, answers, isLast, visibleQuestions, survey.title]);

  const handleBack = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => Math.max(0, i - 1));
      setAnimating(false);
    }, 50);
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setErrors({});
    setCompleted(false);
    setShowResults(false);
  }, []);

  if (completed && showResults) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] px-4 py-10">
        <div className="max-w-[640px] mx-auto">
          <SurveyHeader title={survey.title} description={survey.description} />
          <ResultsView answers={answers} onReset={handleReset} />
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] px-4 py-10">
        <div className="max-w-[640px] mx-auto">
          <SurveyHeader title={survey.title} description={survey.description} />
          <CompletionView
            onViewResults={() => setShowResults(true)}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] px-4 py-10">
      <div className="max-w-[640px] mx-auto">
        <SurveyHeader title={survey.title} description={survey.description} />
        <ProgressBar
          current={currentIndex + 1}
          total={visibleQuestions.length}
        />
        <div
          className={[
            "transition-all duration-200 ease-out",
            animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          ].join(" ")}
        >
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              index={currentIndex}
              answer={answers[currentQuestion.id] ?? null}
              onChange={(value) => handleChange(currentQuestion.id, value)}
              error={errors[currentQuestion.id]}
              visible={true}
            />
          )}
        </div>
        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>
    </div>
  );
}

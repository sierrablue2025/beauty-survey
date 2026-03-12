import { Question, SurveyAnswers, AnswerValue, ValidationResult } from "@/types/survey";

export function shouldDisplay(question: Question, answers: SurveyAnswers): boolean {
  if (!question.displayCondition) return true;

  const { questionId, operator, value } = question.displayCondition;
  const answer = answers[questionId];

  switch (operator) {
    case "notIncludes": {
      if (Array.isArray(answer)) return !answer.includes(value);
      if (typeof answer === "string") return answer !== value;
      return true;
    }
    case "includes": {
      if (Array.isArray(answer)) return answer.includes(value);
      if (typeof answer === "string") return answer === value;
      return false;
    }
    case "equals":
      return answer === value;
    case "notEquals":
      return answer !== value;
    default:
      return true;
  }
}

export function validateAnswer(question: Question, answer: AnswerValue): ValidationResult {
  if (!question.required) return { isValid: true };

  if (answer === null || answer === undefined) {
    return { isValid: false, error: getRequiredError(question) };
  }

  if (question.type === "text") {
    if (typeof answer === "string" && answer.trim() === "") {
      return { isValid: false, error: "入力してください" };
    }
    return { isValid: true };
  }

  if (question.type === "single") {
    if (!answer || answer === "") {
      return { isValid: false, error: "1つ選択してください" };
    }
    return { isValid: true };
  }

  if (question.type === "multiple") {
    if (!Array.isArray(answer) || answer.length === 0) {
      return { isValid: false, error: "少なくとも1つ選択してください" };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

function getRequiredError(question: Question): string {
  if (question.type === "single") return "1つ選択してください";
  if (question.type === "multiple") return "少なくとも1つ選択してください";
  return "入力してください";
}

export function toggleMultipleOption(
  current: string[],
  option: string,
  exclusiveOptions: string[] = []
): string[] {
  const isExclusive = exclusiveOptions.includes(option);
  const isSelected = current.includes(option);

  if (isSelected) {
    return current.filter((o) => o !== option);
  }

  if (isExclusive) {
    return [option];
  }

  return current.filter((o) => !exclusiveOptions.includes(o)).concat(option);
}

export function getVisibleQuestions(
  questions: Question[],
  answers: SurveyAnswers
): Question[] {
  return questions.filter((q) => shouldDisplay(q, answers));
}

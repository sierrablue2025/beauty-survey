export type QuestionType = "single" | "multiple" | "text";

export interface DisplayCondition {
  questionId: string;
  operator: "notIncludes" | "includes" | "equals" | "notEquals";
  value: string;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  description?: string;
  options?: string[];
  exclusiveOptions?: string[];
  displayCondition?: DisplayCondition;
  placeholder?: string;
}

export interface SurveyDefinition {
  title: string;
  description: string;
  questions: Question[];
}

export type AnswerValue = string | string[] | null;

export type SurveyAnswers = Record<string, AnswerValue>;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

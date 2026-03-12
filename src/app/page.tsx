import { SurveyContainer } from "@/components/survey/SurveyContainer";
import { surveyFull } from "@/data/survey-full";
// 短縮版を使う場合は以下に差し替え
// import { surveyShort } from "@/data/survey-short";

export default function Home() {
  return <SurveyContainer survey={surveyFull} />;
}

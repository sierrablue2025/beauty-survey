interface SurveyHeaderProps {
  title: string;
  description: string;
}

export function SurveyHeader({ title, description }: SurveyHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-[24px] font-bold text-[#3E3A39] mb-2">{title}</h1>
      <p className="text-[14px] text-[#6E6763]">{description}</p>
    </div>
  );
}

import { FileText } from "lucide-react";
import { FormattedContent } from "@/components/FormattedContent";

interface SummaryCardProps {
  summary: string | null;
  isLoading: boolean;
  isVisible: boolean;
}

export function SummaryCard({ summary, isLoading, isVisible }: SummaryCardProps) {
  if (!isVisible && !isLoading) return null;

  return (
    <div className="card-elevated rounded-xl p-5 animate-slide-up">
      <div className="section-header">
        <div className="w-9 h-9 rounded-lg bg-action-blue/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-action-blue" />
        </div>
        <h2 className="font-semibold text-foreground">Summary</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-2.5">
          <div className="h-4 animate-shimmer rounded" />
          <div className="h-4 animate-shimmer rounded w-[92%]" />
          <div className="h-4 animate-shimmer rounded w-[88%]" />
          <div className="h-4 animate-shimmer rounded w-[75%]" />
        </div>
      ) : summary ? (
        <FormattedContent content={summary} />
      ) : null}
    </div>
  );
}

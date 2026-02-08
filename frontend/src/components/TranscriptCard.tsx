import { ScrollText, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormattedContent } from "@/components/FormattedContent";

interface TranscriptCardProps {
  transcript: string | null;
  isLoading: boolean;
  isVisible: boolean;
  onClose?: () => void;
}

export function TranscriptCard({ transcript, isLoading, isVisible, onClose }: TranscriptCardProps) {
  if (!isVisible && !isLoading) return null;

  return (
    <div className="card-elevated rounded-xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="section-header">
          <div className="w-9 h-9 rounded-lg bg-action-purple/10 flex items-center justify-center">
            <ScrollText className="w-4 h-4 text-action-purple" />
          </div>
          <h2 className="font-semibold text-foreground">Transcript</h2>
        </div>
        {onClose && !isLoading && (
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close transcript"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 animate-shimmer rounded" style={{ width: `${95 - (i % 3) * 10}%` }} />
          ))}
        </div>
      ) : transcript ? (
        <ScrollArea className="h-[300px] pr-4">
          <FormattedContent content={transcript} />
        </ScrollArea>
      ) : null}
    </div>
  );
}

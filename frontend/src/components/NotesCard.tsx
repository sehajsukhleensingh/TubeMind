import { ListChecks, X } from "lucide-react";
import { FormattedContent } from "@/components/FormattedContent";

const NOTES_CONTENT_CLASS =
  "text-foreground/85 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-none [&_ul]:pl-0 [&_ol]:list-none [&_ol]:pl-0";

interface NotesCardProps {
  notes: string[] | null;
  isLoading: boolean;
  isVisible: boolean;
  onClose?: () => void;
}

export function NotesCard({ notes, isLoading, isVisible, onClose }: NotesCardProps) {
  if (!isVisible && !isLoading) return null;

  return (
    <div className="card-elevated rounded-xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="section-header">
          <div className="w-9 h-9 rounded-lg bg-action-green/10 flex items-center justify-center">
            <ListChecks className="w-4 h-4 text-action-green" />
          </div>
          <h2 className="font-semibold text-foreground">Key Notes</h2>
        </div>
        {onClose && !isLoading && (
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close notes"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 animate-shimmer rounded-full flex-shrink-0 mt-2" />
              <div className="flex-1 h-4 animate-shimmer rounded" style={{ width: `${90 - i * 5}%` }} />
            </div>
          ))}
        </div>
      ) : notes && notes.length > 0 ? (
        <ul className="list-none pl-0 space-y-3">
          {notes.map((note, index) => (
            <li key={index} className="flex items-start gap-2">
              {index === 0 ? (
                <span className="text-action-green font-bold flex-shrink-0 mt-0.5 select-none" aria-hidden>
                  ◆
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <FormattedContent
                  content={note}
                  className={
                    index === 0
                      ? `${NOTES_CONTENT_CLASS} [&_p]:font-semibold [&_*]:text-foreground`
                      : NOTES_CONTENT_CLASS
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

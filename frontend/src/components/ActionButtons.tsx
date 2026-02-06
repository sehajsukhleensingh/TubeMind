import { FileText, ListChecks, ScrollText, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  onGenerateSummary: () => void;
  onGenerateNotes: () => void;
  onGetTranscript: () => void;
  onOpenChat: () => void;
  loadingStates: {
    summary: boolean;
    notes: boolean;
    transcript: boolean;
  };
  completedStates: {
    summary: boolean;
    notes: boolean;
    transcript: boolean;
  };
  disabled: boolean;
}

export function ActionButtons({
  onGenerateSummary,
  onGenerateNotes,
  onGetTranscript,
  onOpenChat,
  loadingStates,
  completedStates,
  disabled,
}: ActionButtonsProps) {
  const actions = [
    {
      label: "Generate Summary",
      icon: FileText,
      onClick: onGenerateSummary,
      loading: loadingStates.summary,
      completed: completedStates.summary,
      color: "text-action-blue",
      bgColor: "bg-action-blue/10",
    },
    {
      label: "Generate Key Notes",
      icon: ListChecks,
      onClick: onGenerateNotes,
      loading: loadingStates.notes,
      completed: completedStates.notes,
      color: "text-action-green",
      bgColor: "bg-action-green/10",
    },
    {
      label: "Get Transcript",
      icon: ScrollText,
      onClick: onGetTranscript,
      loading: loadingStates.transcript,
      completed: completedStates.transcript,
      color: "text-action-purple",
      bgColor: "bg-action-purple/10",
    },
    {
      label: "Ask Questions",
      icon: MessageSquare,
      onClick: onOpenChat,
      loading: false,
      completed: false,
      color: "text-action-orange",
      bgColor: "bg-action-orange/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="action"
          className={cn(
            "h-auto py-4 px-4 flex flex-col items-center gap-2 transition-all",
            action.completed && "ring-1 ring-action-green/30 bg-action-green/5"
          )}
          onClick={action.onClick}
          disabled={disabled || action.loading}
        >
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.bgColor)}>
            {action.loading ? (
              <Loader2 className={cn("w-5 h-5 animate-spin", action.color)} />
            ) : (
              <action.icon className={cn("w-5 h-5", action.color)} />
            )}
          </div>
          <span className="text-sm font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}

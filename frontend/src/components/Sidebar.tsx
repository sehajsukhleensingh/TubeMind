import { Home, History, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VideoHistory {
  id: string;
  title: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeTab: "home" | "history";
  onTabChange: (tab: "home" | "history") => void;
  history: VideoHistory[];
  onHistorySelect: (id: string) => void;
  selectedVideoId?: string;
}

export function Sidebar({
  collapsed,
  onToggle,
  activeTab,
  onTabChange,
  history,
  onHistorySelect,
  selectedVideoId,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-out",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2.5 overflow-hidden", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <PlayCircle className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground tracking-tight">
              TubeMind
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        <button
          onClick={() => onTabChange("home")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150",
            activeTab === "home"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Home</span>}
        </button>
        <button
          onClick={() => onTabChange("history")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150",
            activeTab === "history"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <History className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">History</span>}
        </button>
      </nav>

      {/* History List */}
      {!collapsed && history.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col mt-2 border-t border-sidebar-border">
          <div className="px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
            {history.map((video) => (
              <button
                key={video.id}
                onClick={() => onHistorySelect(video.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 group",
                  selectedVideoId === video.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <p className="text-sm truncate">{video.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

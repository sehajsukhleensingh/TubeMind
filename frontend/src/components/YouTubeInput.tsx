import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface YouTubeInputProps {
  onUrlChange: (url: string) => void;
  value: string;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export function YouTubeInput({ onUrlChange, value, language, onLanguageChange }: YouTubeInputProps) {
  return (
    <div className="card-elevated rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <Link2 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-medium text-foreground text-sm">YouTube Video URL</h2>
          <p className="text-xs text-muted-foreground">Paste any YouTube video link to get started</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-3 sm:items-end">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={value}
            onChange={(e) => onUrlChange(e.target.value)}
            className="h-11 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor="language-select"
          >
            Language (optional)
          </label>
          <select
            id="language-select"
            className="h-11 min-w-[140px] rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ja">Japanese</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );
}

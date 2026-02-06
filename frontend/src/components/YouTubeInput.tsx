import { useState } from "react";
import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface YouTubeInputProps {
  onUrlChange: (url: string) => void;
  value: string;
}

export function YouTubeInput({ onUrlChange, value }: YouTubeInputProps) {
  return (
    <div className="card-elevated rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
          <Link2 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-medium text-foreground text-sm">YouTube Video URL</h2>
          <p className="text-xs text-muted-foreground">Paste any YouTube video link to get started</p>
        </div>
      </div>
      <Input
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onUrlChange(e.target.value)}
        className="h-11 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

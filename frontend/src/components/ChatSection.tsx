import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormattedContent } from "@/components/FormattedContent";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isVisible: boolean;
  onClose: () => void;
}

export function ChatSection({ messages, onSendMessage, isLoading, isVisible, onClose }: ChatSectionProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="card-elevated rounded-xl flex flex-col h-[420px] animate-slide-up">
      {/* Header */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-action-orange/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-action-orange" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Ask Questions</h2>
            <p className="text-xs text-muted-foreground">Chat about the video content</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground/60 text-sm text-center">
              Ask anything about the video...
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm overflow-hidden",
                  message.role === "user"
                    ? "chat-bubble-user rounded-br-md"
                    : "chat-bubble-ai rounded-bl-md"
                )}
              >
                {message.role === "user" ? (
                  <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                ) : (
                  <FormattedContent content={message.content} className="[&_p:my-0.5]" />
                )}
              </div>
              {message.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="chat-bubble-ai rounded-bl-md px-3.5 py-2.5 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about this video..."
            disabled={isLoading}
            className="flex-1 h-10 px-3.5 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50 transition-all text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

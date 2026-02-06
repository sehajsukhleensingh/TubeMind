import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface FormattedContentProps {
  content: string;
  className?: string;
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  if (!content?.trim()) return null;
  return (
    <div
      className={cn(
        "formatted-content text-muted-foreground text-sm leading-relaxed",
        "[&_.katex]:text-[1.15rem] [&_.katex]:font-normal [&_.katex-display]:text-[1.25rem] [&_.katex-display]:my-3",
        "[&_pre]:rounded-lg [&_pre]:bg-muted/80 [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:overflow-x-auto [&_pre]:my-2",
        "[&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:font-mono",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
        "[&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:mt-3 [&_h1]:mb-1 [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-3 [&_h2]:mb-1",
        "[&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:my-1.5",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2",
        "[&_table]:w-full [&_th]:text-left [&_th]:font-medium [&_th]:text-foreground [&_td]:py-1 [&_th]:py-1 [&_th]:pr-2",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { isToolUIPart, type UIMessage } from "ai";
import { ToolPartRenderer } from "@/components/chat/tool-part-renderer";
import type { CheckpointData } from "@/components/chat/learning-checkpoint";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  parts?: UIMessage["parts"];
  onCheckpointAnswer?: (correct: boolean, data: CheckpointData) => void;
};

export const MessageBubble = memo(function MessageBubble({ role, content, parts, onCheckpointAnswer }: MessageBubbleProps) {
  const isUser = role === "user";

  // Extract completed tool parts from assistant messages
  const toolParts =
    !isUser && parts
      ? parts.filter(
          (p) =>
            isToolUIPart(p) &&
            p.state === "output-available"
        )
      : [];

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[80%]">
        {/* Tool result cards — rendered above the text response */}
        {toolParts.length > 0 && (
          <div className="mb-1">
            {toolParts.map((p, i) => {
              if (!isToolUIPart(p) || p.state !== "output-available") return null;
              const toolName =
                p.type === "dynamic-tool" ? p.toolName : p.type.replace(/^tool-/, "");
              return (
                <ToolPartRenderer
                  key={`${toolName}-${p.toolCallId}`}
                  toolName={toolName}
                  state={p.state}
                  input={p.input}
                  output={p.output}
                  onCheckpointAnswer={onCheckpointAnswer}
                />
              );
            })}
          </div>
        )}

        {/* Text content bubble */}
        {content && (
          <div
            className={cn(
              "break-words px-4 py-2.5 text-sm leading-relaxed",
              isUser
                ? "whitespace-pre-wrap rounded-2xl rounded-br-md bg-amber-800 text-white"
                : "rounded-2xl rounded-bl-md bg-white text-stone-800 shadow-sm"
            )}
          >
            {isUser ? (
              content
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className="rounded bg-stone-100 px-1 py-0.5 text-xs font-mono">{children}</code>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { Markdown } from "./Markdown";

export function MessageList({ messages, pending }: { messages: ChatMessage[]; pending: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  const last = messages[messages.length - 1];
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages.length, last?.content]);

  if (messages.length === 0 && !pending) {
    return (
      <div className="grid h-full place-items-center px-6 text-center text-muted-foreground">
        <p>Envie uma mensagem para começar a conversar com o Gemini.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-[0.95rem]">
            {m.content}
          </div>
        ) : (
          <div key={m.id} className="min-w-0 max-w-full">
            <Markdown>{m.content}</Markdown>
          </div>
        ),
      )}
      {pending && last?.role === "user" && (
        <div className="flex items-center gap-1.5 text-muted-foreground" role="status" aria-label="Gemini está processando">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}

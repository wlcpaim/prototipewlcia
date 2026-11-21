import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { getChatHistory } from "@/services/chat.functions";
import { useChat } from "@/hooks/use-chat";
import { MessageList } from "@/components/chat/MessageList";
import { Composer } from "@/components/chat/Composer";
import { GEMINI_MODEL } from "@/config/app";

const historyQuery = queryOptions({ queryKey: ["chat-history"], queryFn: () => getChatHistory(), staleTime: Infinity });

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Chat — WLC IA" },
      { name: "description", content: "Converse com o Gemini no WLC IA." },
      { property: "og:title", content: "Chat — WLC IA" },
      { property: "og:description", content: "Converse com o Gemini no WLC IA." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(historyQuery),
  component: ChatPage,
});

function ChatPage() {
  const { data } = useSuspenseQuery(historyQuery);
  const { messages, streaming, error, send, stop } = useChat(data);
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h1 className="text-sm font-semibold">Chat</h1>
        <span className="font-mono text-xs text-muted-foreground">{GEMINI_MODEL}</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <MessageList messages={messages} pending={streaming} />
      </div>
      {error && (
        <div role="alert" className="mx-auto mb-2 flex w-full max-w-3xl items-start gap-2 px-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-words">{error}</span>
        </div>
      )}
      <Composer onSend={send} onStop={stop} streaming={streaming} />
    </div>
  );
}

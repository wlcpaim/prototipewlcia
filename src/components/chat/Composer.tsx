import { useState, type KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";

export function Composer({ onSend, onStop, streaming }: { onSend: (t: string) => void; onStop: () => void; streaming: boolean }) {
  const [text, setText] = useState("");
  function submit() {
    const t = text.trim();
    if (!t || streaming) return;
    onSend(t);
    setText("");
  }
  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }
  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-3">
      <div className="flex items-end gap-2 rounded-2xl border border-input bg-card p-2 focus-within:ring-2 focus-within:ring-ring">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          placeholder="Mensagem para o Gemini"
          aria-label="Mensagem"
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none placeholder:text-muted-foreground [field-sizing:content]"
        />
        {streaming ? (
          <button type="button" onClick={onStop} aria-label="Parar geração" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-foreground text-background">
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={!text.trim()} aria-label="Enviar" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40">
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

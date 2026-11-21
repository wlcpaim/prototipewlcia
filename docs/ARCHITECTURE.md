# WLC IA 0.1.0 — Arquitetura

## Visão geral
TanStack Start (React 19, SSR em Cloudflare Workers) + Lovable Cloud (PostgreSQL, Auth). Segredos só no servidor.

```text
Navegador ──(bearer da sessão)──> Funções de servidor / /api/chat ──> Gemini API | GitHub API | PostgreSQL (RLS)
```

## Estrutura de pastas
| Pasta | Responsabilidade |
|---|---|
| `src/routes/index.tsx` | Landing + login Google |
| `src/routes/_authenticated/` | Área protegida (`route.tsx` guarda), `chat.tsx`, `settings.tsx` |
| `src/routes/api/chat.ts` | Streaming do chat (POST) |
| `src/components/nav/` | Navegação única (lateral ≥768px, inferior <768px) |
| `src/components/chat/` | Lista de mensagens, Markdown, campo de envio |
| `src/components/settings/` | Painéis Banco, Conexões, Gemini, GitHub |
| `src/hooks/use-chat.ts` | Envio, leitura do streaming, Stop |
| `src/services/*.server.ts` | Código só do servidor (Gemini, GitHub, status) |
| `src/services/*.functions.ts` | Funções de servidor autenticadas |
| `src/config/app.ts` | Nome, versão, modelo Gemini, URLs |
| `src/types/` | Tipagens compartilhadas |
| `src/integrations/` | Clientes gerados (não editar) |

## Autenticação
1. Landing chama `lovable.auth.signInWithOAuth("google")` (Google OAuth real).
2. Sessão salva pelo cliente Auth; `__root` escuta mudanças.
3. `_authenticated/route.tsx` valida `getUser()` e redireciona para `/` sem sessão.
4. Funções de servidor usam `requireSupabaseAuth` (bearer anexado por `attachSupabaseAuth` em `src/start.ts`).
5. Sair: botão no menu → `signOut()` e limpeza do cache.

## Fluxo do chat / Gemini
1. `use-chat` envia `POST /api/chat` com o token da sessão.
2. O servidor valida o usuário, grava a mensagem (tabela `messages`), carrega o histórico completo.
3. Chama `streamGenerateContent?alt=sse` do modelo `GEMINI_MODEL` com cabeçalho `x-goog-api-key` (obrigatório para chaves `AQ.`).
4. Repassa o texto em streaming; ao terminar (ou ao Stop, que aborta o fetch), grava a resposta (parcial, se interrompida).
5. Erros do Gemini são devolvidos literalmente (status + mensagem) e registrados em `integration_status`.
Sem prompt de sistema, sem filtros próprios.

## Fluxo GitHub
Token `GITHUB_TOKEN` (servidor). Somente GET: `/user`, `/user/repos`, `/repos/{repo}`. Seleção salva em `github_selection`. Nenhuma escrita no GitHub.

## Banco de dados
| Tabela | Finalidade |
|---|---|
| `conversations` | Conversa única por usuário |
| `messages` | Mensagens (FK → conversations, cascade) |
| `integration_status` | Estado/último teste/erro por integração e usuário, sem segredos |
| `github_selection` | Repositório selecionado |
| `app_user_connections` | Obsoleta, sem uso (sem políticas: inacessível a usuários) |

RLS em todas: `auth.uid() = user_id`. Função `inspect_schema()` (security definer, somente leitura, exige login) alimenta a página Banco de Dados.

## Variáveis de ambiente (segredos do servidor)
| Nome | Uso |
|---|---|
| `GEMINI_API_KEY` | Chave Google AI Studio |
| `GITHUB_TOKEN` | Personal Access Token GitHub (leitura) |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Geridos pelo Lovable Cloud |

## Executar
`bun install` · `bun run dev` · testes: `bunx vitest run`.

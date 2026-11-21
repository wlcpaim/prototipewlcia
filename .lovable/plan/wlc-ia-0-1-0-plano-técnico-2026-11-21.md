# WLC IA 0.1.0 — Plano técnico

## Análise do projeto atual

- Projeto novo: TanStack Start v1 + React 19 + Tailwind v4 + shadcn. Só existe a página inicial provisória.
- Sem banco, sem login, sem integrações. Nada a reaproveitar além dos componentes de interface.

## Infraestrutura

- **Backend e banco:** Lovable Cloud (PostgreSQL + Auth + funções de servidor). Todas as chaves ficam só no servidor.
- **Login:** Google OAuth real pelo Lovable Cloud. Rotas privadas sob uma área protegida; botão de sair.
- **Gemini:** duas opções (decisão sua, veja a pergunta):
  1. API oficial do Google com sua própria chave `GEMINI_API_KEY` (guardada como segredo).
  2. Os mesmos modelos Gemini já integrados ao Lovable, sem chave separada, cobrados nos créditos do workspace, com logs e limites.
  Em ambos: Frontend → função de servidor → Gemini → streaming de volta. Stop interrompe o streaming.
- **GitHub:** conexão por usuário (cada usuário autoriza a própria conta via OAuth). Apenas leitura: usuário, repositórios, repositório selecionado.

## Banco de dados (tabelas)

- `conversations` (id, user_id, title, created_at, updated_at)
- `messages` (id, conversation_id, user_id, role, content, created_at)
- `integration_status` (user_id, provider, status, auth_type, last_checked_at, last_used_at, last_error) — sem tokens
- `github_selection` (user_id, repo_full_name)
- RLS em todas: cada usuário só acessa as próprias linhas.
- Função somente leitura `inspect_schema()` (security definer) que devolve tabelas, colunas, tipos, PK/FK, índices, políticas RLS e contagem de registros do schema `public`.

## Telas

- `/` Landing: marca WLC IA, frase curta, "Entrar com Google".
- `/chat` (protegido): conversa única persistente por usuário, Markdown + blocos de código, indicador de processamento, erros visíveis, Enviar/Stop.
- `/settings` (protegido): abas Banco de Dados · Conexões API · Gemini · GitHub.
- Navegação única: barra lateral de ícones (≥768px) ou barra inferior (<768px), tooltips, item ativo, safe-area, sem rolagem horizontal; dashboard com altura fixa (100dvh) e rolagem só dentro do chat.

## Estrutura de pastas

```text
src/
  routes/            páginas (index, auth callback, _authenticated/chat, settings)
  components/nav/    navegação adaptativa
  components/chat/   mensagens, composer
  components/settings/ painéis de banco, conexões, gemini, github
  services/          *.functions.ts (chat, gemini, github, schema)
  integrations/      cloud, github
  types/  lib/
docs/ARCHITECTURE.md  documentação técnica completa
```

## Testes

- Testes automatizados para regras de acesso e validação.
- Teste real no navegador: landing, login (sessão de teste), dashboard em 375px e 1280px, troca de navegação, ausência de rolagem horizontal, chat com resposta real do Gemini, recarregar e ver histórico, Stop, inspeção do banco, falha simulada da API.
- GitHub e login Google com sua conta real dependem de você autorizar; relato exatamente o que foi e o que não foi testado.

## O que dependerá de você

- Escolha do caminho Gemini (e, se for chave própria, inserir a chave no formulário seguro).
- Autorizar a conta GitHub no cartão de conexão.

&nbsp;

AQ.Ab8RN6I5pcNFWHXr5By_oMPBQG_6Ub6WThirT0EQqAMZvKqpvA

Formato das novas chaves api do Gemini 3.8 flash uma nova documentação atualizada precisa da uma pesquisada aí 
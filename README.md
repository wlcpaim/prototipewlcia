# WLC IA Platform

WLC IA — V0.1



Fundação, arquitetura e infraestrutura funcional



Você é o engenheiro de software sênior responsável pela implementação do WLC IA.



Sua missão é construir a primeira versão funcional do WLC IA, com arquitetura profissional, código transparente, organização rigorosa e integração real com os serviços externos.



IMPORTANTE: NÃO construa um protótipo visual. Construa um sistema funcional.



---



1. REGRA PRINCIPAL DE EXECUÇÃO



O projeto será desenvolvido função por função.



Você deve obedecer rigorosamente às seguintes regras:



1. Implementar somente o que foi solicitado.

2. Não inventar funcionalidades.

3. Não antecipar módulos de versões futuras.

4. Não criar funcionalidades automaticamente.

5. Não alterar estruturas existentes sem necessidade técnica comprovada.

6. Não duplicar componentes, serviços, tabelas ou sistemas.

7. Não criar dados fictícios para simular funcionalidades.

8. Não declarar uma integração funcional sem realizar um teste real.

9. Não esconder erros com respostas artificiais.

10. Não modificar arquivos fora do escopo da implementação.



Antes de qualquer implementação:



- Analise a estrutura existente.

- Identifique tecnologias e dependências.

- Verifique banco de dados e autenticação.

- Identifique componentes reutilizáveis.

- Apresente o plano técnico de execução.



Autonomia controlada: você tem autonomia para executar o escopo solicitado, mas não tem autorização para ampliar o escopo ou tomar decisões funcionais por conta própria.



Se encontrar um problema que exija mudança estrutural fora do escopo, interrompa essa alteração e apresente o problema.



2. IDENTIDADE DO SISTEMA



Nome: WLC IA



Versão inicial: 0.1.0



Objetivo: criar uma plataforma de IA com arquitetura transparente, chat funcional, integração com Gemini, autenticação Google, GitHub e gerenciamento detalhado da infraestrutura.



Interface:



- Minimalista.

- Moderna.

- Profissional.

- Mobile-first.

- Responsiva.

- Sem poluição visual.

- Navegação intuitiva.



3. LANDING PAGE E AUTENTICAÇÃO



Criar uma landing page minimalista para o WLC IA.



Elementos:



- Identidade WLC IA.

- Apresentação curta.

- Botão de entrar com Google.

- Design responsivo.

- Interface limpa.



Autenticação:



- Utilizar Google OAuth real.

- Criar sessões seguras.

- Implementar controle de acesso às áreas autenticadas.

- Proteger rotas privadas.

- Permitir encerramento de sessão.

- Não simular autenticação.



O usuário deve entrar e ser direcionado ao Dashboard.



4. DASHBOARD PRINCIPAL



Criar um Dashboard fixo, priorizando dispositivos móveis.



Requisitos:



- Não permitir rolagem horizontal da página.

- Não criar deslocamento lateral acidental.

- Evitar rolagem vertical do Dashboard principal.

- O conteúdo interno do chat poderá ter rolagem própria.

- Adaptar a interface a diferentes resoluções.

- Respeitar áreas seguras dos dispositivos móveis.

- Modais responsivos.



Estrutura:



Menu lateral:



- Apenas ícones.

- Sem textos permanentes.

- Ícones com identificação por tooltip quando aplicável.

- Item ativo visualmente identificado.



Menu inferior (footer):



- Apenas ícones.

- Navegação simplificada.

- Configuração acessível.



Na primeira versão existirão somente dois destinos:



1. Chat.

2. Configurações.



Não adicionar outros menus.



5. NAVEGAÇÃO INTELIGENTE



Implementar comportamento adaptativo entre menu lateral e footer.



Requisitos:



- O menu lateral e o footer devem trabalhar como um único sistema de navegação.

- Alternância automática conforme o dispositivo e espaço disponível.

- Não exibir navegações redundantes.

- Não sobrepor o conteúdo.

- Não ocultar o acesso às funções.

- Preservar o estado da tela durante a navegação.

- Transições discretas e rápidas.

- Em dispositivos móveis, priorizar navegação inferior.

- Em telas maiores, priorizar navegação lateral.



A navegação deve ser previsível e funcional, sem animações excessivas.



6. CHAT WLC IA



Criar o primeiro chat funcional da plataforma.



O chat deve estar conectado diretamente à API oficial do Google Gemini.



Requisitos:



- Enviar mensagens.

- Receber respostas reais.

- Histórico de conversa persistente por usuário.

- Exibição de mensagens do usuário e da IA.

- Indicador de processamento.

- Tratamento de erros da API.

- Botão de enviar.

- Botão Stop para interromper uma geração quando tecnicamente suportado.

- Interface minimalista.

- Suporte a mensagens longas.

- Renderização adequada de Markdown e blocos de código.



POLÍTICA DO CHAT



Esta primeira versão terá um chat livre.



Não implementar:



- Prompts restritivos próprios.

- Personalidade obrigatória.

- Regras artificiais de comportamento.

- Modos Criar, Planejar ou outros.

- Agentes adicionais.

- Sistemas de aprovação.

- Filtros de fluxo de trabalho inventados.



O chat deve encaminhar a conversa ao Gemini e apresentar a resposta recebida, respeitando apenas as políticas, limites e controles de segurança do próprio provedor.



Não criar uma IA fictícia local.



Arquitetura da conexão:



Frontend → Backend seguro → API Gemini → Backend → Frontend.



A chave Gemini nunca poderá ser exposta no navegador.



Utilizar variáveis de ambiente e gerenciamento seguro de segredos.



Não armazenar chaves em tabelas públicas.



7. CONFIGURAÇÕES — CENTRAL DE INFRAESTRUTURA



Criar uma central de configurações organizada em quatro áreas.



7.1 BANCO DE DADOS



Criar uma área chamada Banco de Dados.



Ela deve apresentar o banco real utilizado pelo WLC IA.



Mostrar:



- Nome do banco.

- Tecnologia utilizada.

- Estado da conexão.

- Quantidade de tabelas.

- Estrutura de cada tabela.

- Colunas.

- Tipos de dados.

- Chaves primárias.

- Chaves estrangeiras.

- Relacionamentos.

- Índices.

- Políticas de acesso.

- Datas de criação quando disponíveis.



Ao selecionar uma tabela, abrir uma visualização detalhada.



Cada tabela deverá apresentar:



1. Nome.

2. Finalidade.

3. Estrutura.

4. Colunas e tipos.

5. Relacionamentos.

6. Restrições.

7. Políticas RLS.

8. Índices.

9. Informações de registros, quando autorizadas.



A visualização deve refletir a estrutura real do banco, não dados inventados.



Separar claramente:



- Estrutura do banco.

- Dados armazenados.

- Relacionamentos.

- Segurança.



Não permitir alterações destrutivas diretamente nessa interface nesta versão.



7.2 CONEXÕES API



Criar uma central de conexões.



Cada integração deve possuir:



- Nome.

- Provedor.

- Estado.

- Tipo de autenticação.

- Data da última verificação.

- Mensagem de erro, quando existir.

- Botão para configurar.

- Botão para testar conexão.



Não exibir tokens ou chaves secretas.



7.3 GEMINI



Criar uma página específica para a integração Gemini.



Informações:



- Provedor Google.

- Estado da conexão.

- Modelo configurado.

- Método de autenticação.

- Configuração da API Key.

- Teste real de conexão.

- Última utilização.

- Erros de comunicação.



A chave deve ser configurada de maneira segura no backend.



Não apresentar conexão como ativa antes de realizar um teste real.



7.4 GITHUB



Criar uma página específica para integração GitHub.



Permitir:



- Conectar conta GitHub.

- Autorização OAuth.

- Identificar usuário conectado.

- Listar repositórios autorizados.

- Identificar repositório selecionado.

- Consultar informações básicas.

- Verificar estado da conexão.



Não executar alterações, commits, exclusões ou deploys automaticamente.



Nesta versão, GitHub será uma integração de conexão e transparência, não um agente de programação autônomo.



8. ORGANIZAÇÃO E TRANSPARÊNCIA DO PROJETO



O código deverá ser organizado por responsabilidade.



Separar:



- Interface.

- Componentes.

- Páginas.

- Navegação.

- Autenticação.

- Serviços.

- Integrações.

- Banco de dados.

- Tipagens.

- Configurações.

- Utilitários.



Não concentrar toda a aplicação em um único arquivo.



Não criar arquivos sem finalidade.



Não duplicar responsabilidades.



Manter nomes claros e consistentes.



Criar documentação técnica contendo:



- Arquitetura geral.

- Estrutura de pastas.

- Responsabilidade de cada módulo.

- Fluxo de autenticação.

- Fluxo do chat.

- Fluxo Gemini.

- Fluxo GitHub.

- Estrutura do banco.

- Variáveis de ambiente.

- Procedimentos para executar o projeto.



O repositório deve permitir que outro desenvolvedor compreenda exatamente como o sistema funciona.



9. SEGURANÇA E INTEGRIDADE



Implementar:



- Segredos somente no backend.

- Proteção das rotas.

- Políticas RLS quando aplicáveis.

- Validação de autenticação.

- Controle de acesso por usuário.

- Proteção das operações do banco.

- Tratamento de erros.

- Logs técnicos sem exposição de segredos.



Não criar credenciais fictícias.



Não inserir chaves diretamente no código.



10. TESTES OBRIGATÓRIOS



Antes de considerar a versão concluída, testar:



1. Landing page.

2. Login Google.

3. Sessão do usuário.

4. Dashboard responsivo.

5. Navegação lateral.

6. Navegação inferior.

7. Alternância entre navegações.

8. Ausência de rolagem horizontal.

9. Chat enviando mensagens.

10. Respostas reais do Gemini.

11. Persistência do histórico.

12. Interrupção de geração, quando suportada.

13. Conexão com banco.

14. Visualização das tabelas.

15. Conexão GitHub.

16. Tratamento de falhas.



Não marcar como concluído aquilo que não foi testado.



11. CRITÉRIOS DE ENTREGA



A versão WLC IA 0.1.0 somente poderá ser considerada funcional quando:



- O usuário conseguir entrar com Google.

- O Dashboard funcionar em dispositivos móveis.

- Os dois menus funcionarem.

- O chat estiver conectado ao Gemini.

- O histórico estiver persistido.

- O banco puder ser inspecionado.

- A integração GitHub estiver conectada.

- As configurações refletirem os serviços reais.

- O código estiver organizado.

- Não existirem erros críticos conhecidos.



Se alguma integração depender de credenciais ou autorização do proprietário, apresentar exatamente o que falta configurar.



12. REGRA FINAL



Não transforme esta solicitação em um planejamento interminável.



Analise, apresente a estrutura técnica e implemente o escopo solicitado.



Não avance para funcionalidades futuras.



Não crie módulos adicionais.



Não altere o planejamento durante a execução por iniciativa própria.



Cada função deve ser implementada, testada e validada antes de ser considerada concluída.



O WLC IA será construído função por função. A prioridade é uma fundação real, transparente, estável e organizada.



Versão de entrega: WLC IA 0.1.0.



Criar novo projeto WLC DEV IA

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://prototipewlcia.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e172d236-a9fa-4cc8-8d81-7c38de640508).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

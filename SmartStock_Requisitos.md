# SmartStock — Planejamento de Requisitos e Processos

**Projeto:** SmartStock  
**Participantes:** Eduardo Pereira, Matheus Fraiz, Patrick de Oliveira

---

## 1) Planning Poker — Sessão detalhada

O Planning Poker é uma técnica de estimativa colaborativa onde cada integrante vota de forma independente usando a sequência Fibonacci (1,2,3,5,8,13...). A sessão visa alcançar consenso após discussão das diferenças.

Participantes: Eduardo Pereira (EP), Matheus Fraiz (MF), Patrick de Oliveira (PO).

### 1.1 Tabela de votos por requisito (estimativas individuais e consenso)

| ID | Requisito Funcional | Eduardo (EP) | Matheus (MF) | Patrick (PO) | Consenso (SP) | Justificativa do Consenso |
|---|---|---:|---:|---:|---:|---|
| RF01 | Cadastro de empresa e usuário administrador inicial | 3 | 2 | 3 | 3 | Validações, criação de entidade Empresa e seed do admin — esforço médio por regras de validação e segurança. |
| RF02 | Autenticação (JWT, refresh) | 5 | 3 | 5 | 5 | Implementação segura de login, refresh token e middleware de proteção; testes e handling de erros exigem mais trabalho. |
| RF03 | Login multiempresa | 3 | 5 | 3 | 3 | UI de seleção de empresa + persistência da sessão por empresa — moderado. Diferença de voto pelo impacto na UX. |
| RF04 | CRUD categorias por empresa | 2 | 2 | 2 | 2 | CRUD simples, validação e isolamento por empresa. |
| RF05 | CRUD fornecedores por empresa | 3 | 3 | 2 | 3 | Formulários com campos de contato, integração em listas de produtos; esforço médio. |
| RF06 | CRUD produtos por empresa (SKU, estoque mínimo) | 5 | 5 | 5 | 5 | SKU único, relacionamentos, validação e regras de negócio — crítico para MVP. |
| RF07 | Registro movimentações (entrada/saída/ajuste) | 5 | 8 | 5 | 5 | Integridade do estoque, registros auditáveis e conformidade; MF estimou mais por edge cases, mas consenso em SP moderado/alto. |
| RF08 | Bloquear saídas com estoque insuficiente | 3 | 3 | 3 | 3 | Regra simples porém crítica; test coverage necessário. |
| RF09 | Dashboard (resumo e gráfico diário) | 5 | 5 | 5 | 5 | Agregação e performance: consultas, cache e visualizações. |
| RF10 | Gestão de usuários por perfil | 3 | 3 | 3 | 3 | Permissões, telas administrativas e segurança de roles. |
| RF11 | Alerta estoque baixo via WebSocket | 3 | 5 | 3 | 3 | Push em tempo real e infra; MF estimou mais por deploy e testes. |
| RF12 | Frontend: tema claro/escuro e i18n | 2 | 2 | 2 | 2 | Trabalho de CSS e i18n leve; baixo esforço. |

> Observação: as colunas "Eduardo (EP) / Matheus (MF) / Patrick (PO)" são as estimativas antes do consenso; "Consenso" é a nota acordada.

### 1.2 Complexidade, Story Points e Sprint destino

| ID | Requisito | Complexidade | Story Pts (SP) | Tempo Est. | Sprint Destino |
|---|---|---:|---:|---:|---|
| RF01 | Cadastro empresa / usuário admin | Média | 3 SP | 8h | Sprint 1
| RF02 | Autenticação JWT | Alta | 5 SP | 24h | Sprint 1
| RF03 | Login multiempresa | Média | 3 SP | 12h | Sprint 1
| RF04 | CRUD categorias | Baixa | 2 SP | 8h | Sprint 1
| RF05 | CRUD fornecedores | Média | 3 SP | 16h | Sprint 2
| RF06 | CRUD produtos | Alta | 5 SP | 40h | Sprint 2
| RF07 | Movimentações de estoque | Alta | 5 SP | 48h | Sprint 3
| RF08 | Bloquear saídas insuficiente | Média | 3 SP | 12h | Sprint 3
| RF09 | Dashboard resumo / gráfico | Alta | 5 SP | 40h | Sprint 4
| RF10 | Gestão de usuários por perfil | Média | 3 SP | 24h | Sprint 2
| RF11 | Alertas via WebSocket | Média | 3 SP | 20h | Sprint 4
| RF12 | Tema claro/escuro e i18n | Baixa | 2 SP | 12h | Sprint 4

Total estimado: 39 SP (ajustável) — velocidade alvo: ~20–25 SP/sprint.

---

## 2) Scrum — Organização completa (modelo AutoSoccer adaptado)

> Seguindo o modelo do AutoSoccer, as Sprints e datas de exemplo foram mantidas para facilitar comparações e planilhas.

### 2.1 Product Backlog — Priorizado (alta→baixa)

| Ordem | ID | História de Usuário | Prioridade | SP | Sprint |
|---:|---|---|---:|---:|---:|
| 1 | RF02 | Como usuário, quero autenticar com email/senha e receber token JWT | Alta | 5 | Sprint 1
| 2 | RF06 | Como gerente, quero cadastrar produtos com SKU, preço e estoque mínimo | Alta | 5 | Sprint 2
| 3 | RF07 | Como operador, quero registrar entradas/saídas/ajustes no estoque | Alta | 5 | Sprint 3
| 4 | RF09 | Como gestor, quero visualizar dashboard com gráficos diários | Alta | 5 | Sprint 4
| 5 | RF01 | Cadastro de empresa e usuário administrador inicial | P1 | 3 | Sprint 1
| 6 | RF04 | Gerenciar categorias por empresa | P2 | 2 | Sprint 1
| 7 | RF05 | Gerenciar fornecedores por empresa | P2 | 3 | Sprint 2
| 8 | RF08 | Bloquear saídas com estoque insuficiente | P1 | 3 | Sprint 3
| 9 | RF10 | Gestão de usuários por perfil | P2 | 3 | Sprint 2
| 10 | RF11 | Alerta de estoque baixo via WebSocket | P2 | 3 | Sprint 4
| 11 | RF03 | Login multiempresa | P3 | 3 | Sprint 1
| 12 | RF12 | Tema claro/escuro e i18n | P3 | 2 | Sprint 4

### 2.2 Sprint Planning detalhado (exemplo com tarefas e horas)

Sprint length: 2 semanas.

Sprint 1 — 19 – 30 de Maio de 2026 — Objetivo: Autenticação, Cadastro Empresa/Admin, CRUD Categorias (19 SP planejados)

| Tarefa | Responsável | Horas Est. | Status |
|---|---|---:|---|
| Configurar ambiente (Docker, DB, repositórios) | Todos | 6h | ✅ Concluído
| RF01 — Backend: endpoint cadastro empresa + seed admin | Eduardo | 6h | ✅ Concluído
| RF01 — Frontend: tela cadastro empresa/admin (HTML/CSS) | Matheus | 4h | ✅ Concluído
| RF02 — Backend: autenticação JWT + refresh + middleware | Patrick / Eduardo | 12h | ✅ Concluído
| RF02 — Frontend: tela login + seleção empresa | Matheus | 8h | ✅ Concluído
| RF04 — Backend: CRUD categorias | Eduardo | 8h | ✅ Concluído
| RF04 — Frontend: tela categorias (lista/crud) | Matheus | 12h | ✅ Concluído
| Testes integrados e revisão de PRs | Todos | 6h | ✅ Concluído

Total Sprint 1: 62h estimadas — 62h realizadas — Status: ✅ Concluída

Sprint 2 — 02 – 13 de Junho de 2026 — Objetivo: Produtos, Fornecedores, Gestão de usuários (29 SP planejados)

| Tarefa | Responsável | Horas Est. | Status |
|---|---|---:|---|
| Modelagem produto (SKU, preço, estoque mínimo) | Eduardo | 6h | ✅ Concluído
| RF06 — Backend: CRUD Produtos | Patrick / Eduardo | 20h | ✅ Concluído
| RF06 — Frontend: formulários e listagem produtos | Matheus | 18h | ✅ Concluído
| RF05 — Backend: CRUD Fornecedores | Eduardo | 8h | ✅ Concluído
| RF05 — Frontend: tela fornecedores | Matheus | 6h | ✅ Concluído
| RF10 — Backend: gestão usuários por perfil | Patrick | 10h | 🔄 Em andamento
| Testes de integração | Todos | 12h | 📋 Planejado

Total Sprint 2: 80h estimadas — Status: 🔄 Em andamento

Sprint 3 — 16 – 27 de Junho de 2026 — Objetivo: Movimentações e regras de estoque (13 SP planejados)

| Tarefa | Responsável | Horas Est. | Status |
|---|---|---:|---|
| RF07 — Definir modelo de movimentação e auditoria | Eduardo | 8h | 📋 Planejado
| RF07 — Backend: endpoints de entrada/saída/ajuste | Patrick | 20h | 📋 Planejado
| RF08 — Implementar bloqueio de saída (validação) | Eduardo | 8h | 📋 Planejado
| Frontend: telas de registro de movimentações | Matheus | 16h | 📋 Planejado
| Testes de integração e carga | Todos | 14h | 📋 Planejado

Sprint 4 — 30 de Junho – 06 de Julho de 2026 — Objetivo: Dashboard, alertas e deploy (24 SP planejados)

| Tarefa | Responsável | Horas Est. | Status |
|---|---|---:|---|
| RF09 — Backend: APIs de agregação e cache | Eduardo | 12h | 📋 Planejado
| RF09 — Frontend: dashboards e gráficos diários | Matheus | 20h | 📋 Planejado
| RF11 — Implementar WebSocket para alertas | Patrick | 12h | 📋 Planejado
| Responsividade e ajustes finais | Todos | 10h | 📋 Planejado
| Testes finais e deploy (Vercel + DB) | Todos | 8h | 📋 Planejado

---

### 2.3 Protótipos Front-end (Sprint 1)

Arquivos protótipo (em `docs/`):
- `sprint1_frontend.html` — Tela de login e lista de categorias (HTML/CSS simples, sem dependências).

### 2.4 Reuniões Diárias — Exemplos (Daily Scrum)

Cada daily: 15 minutos — perguntas: (1) O que fiz ontem? (2) O que farei hoje? (3) Impedimentos?

Daily — 19 de Maio de 2026 — Sprint 1, Dia 1

| Integrante | O que fiz ontem? | O que farei hoje? | Impedimentos |
|---|---|---|---|
| Eduardo | Revisão dos RFs, preparação do ambiente | Iniciar endpoint de cadastro de empresa e modelagem | Nenhum
| Matheus | Wireframes das telas de login/cadastro | Iniciar HTML/CSS das telas | Aguardando definição de paleta de cores
| Patrick | Modelagem inicial de entidades e migrations | Implementar migrations e seed inicial | Nenhum

Daily — 23 de Maio de 2026 — Sprint 1, Dia 5

| Integrante | O que fiz ontem? | O que farei hoje? | Impedimentos |
|---|---|---|---|
| Eduardo | Endpoint de registro (hash bcrypt) concluído | Implementar login e geração de JWT | Nenhum
| Matheus | Telas de login e cadastro responsivas | Iniciar frontend do CRUD de categorias | Pequeno conflito CSS em componente
| Patrick | Seeds e migrations concluídos | Implementar endpoint de refresh token | Ajustar versão de dependência Sequelize

Daily — 30 de Maio de 2026 — Sprint 1, Dia 10 (último dia)

| Integrante | O que fiz ontem? | O que farei hoje? | Impedimentos |
|---|---|---|---|
| Eduardo | Integração auth JWT com frontend | Revisão de PRs e suporte para demo | Nenhum
| Matheus | Frontend do CRUD categorias finalizado | Preparar demo e ajustes mobile | Hover inconsistente no Safari
| Patrick | Documentação API (Swagger) e testes finais | Rodar testes de integração | Nenhum

### 2.5 Sprint Review — Exemplo (Sprint 1)

Data: 30 de Maio de 2026

- Itens planejados: RF01, RF02, RF04
- Itens entregues: RF01 (Cadastro), RF02 (Autenticação JWT), RF04 (CRUD Categorias)
- Demonstração: formulário de cadastro, fluxo de login com JWT e listagem/CRUD de categorias
- Feedback do stakeholder: solicitar mensagem de boas-vindas pós-cadastro e melhorias na mensagem de erro de login
- Resultado: Sprint aceita; itens de feedback adicionados ao backlog para priorização

### 2.6 Retrospectiva — Exemplo (Sprint 1)

Formato: Start / Stop / Continue + Ações

Continue
- Divisão clara de responsabilidades (infra / front / back)
- Comunicação diária e PRs para revisão

Stop
- Adiar PRs até último dia
- Subestimar tempo de integração (altas dependências)

Start (ações)
- Reservar 20% do tempo da sprint para integração
- Fixar versões de dependências no package.json
- Criar PRs com 1 dia de antecedência ao fim da sprint

---

## 3) Kanban — Quadro e métricas

Colunas: Backlog | Análise | Desenvolvimento | Teste | Pronto

### 3.1 Exemplo de quadro (estado inicial — início Sprint 2 — 09/06/2026)

| Backlog | Análise | Desenvolvimento | Teste | Pronto |
|---|---|---|---|---|
| RF09 — Dashboard | RF11 — Alertas WS | RF06 — CRUD Produtos | RF10 — Gestão usuários | RF01 — Cadastro
| RF05 — Fornecedores | RF07 — Movimentações (refinar) | RF03 — Login multiempresa |  | RF04 — Categorias

### 3.2 Métricas Kanban (exemplo)

| Métrica | Valor | Observação |
|---|---:|---|
| Total de itens mapeados | 12 RF | Todos os RFs funcionais listados
| Itens no Backlog | 5 | Posições pós-MVP
| Itens em Análise | 1 | RF11 em refinamento
| Itens em Desenvolvimento | 2 | Dentro do WIP limite
| Itens em Teste | 1 | RF10 em validação
| Itens Prontos | 3 | RF01, RF02, RF04 — Sprint 1
| Lead Time médio (Sprint 1) | 5,5 dias | Tempo do Backlog até Pronto
| Cycle Time médio (Sprint 1) | 3,2 dias | Tempo em Desenvolvimento até Pronto
| Taxa de conclusão | 25% | 3/12 entregues até o início da Sprint 2

---

## Anexos e artefatos
- Protótipos front-end: `sprint1_frontend.html` (em docs/)
- Templates de reuniões: daily, review e retrospectiva (tabelas acima servem de modelo)
- Observação: posso exportar essa versão para DOCX formatado se desejar.

---

*Documento gerado automaticamente pelo assistente — adaptado ao formato detalhado de AutoSoccer.*

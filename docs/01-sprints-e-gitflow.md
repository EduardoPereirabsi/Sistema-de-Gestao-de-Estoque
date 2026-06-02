# Sprints e Gitflow

## Estrategia de branches

O projeto adotou uma estrategia baseada em Gitflow simplificado:

- `main`: linha principal com integracoes estaveis
- `develop`: linha de integracao entre entregas
- branches de feature por modulo ou sprint, por exemplo:
  - `auth-backend`
  - `auth-frontend`
  - `crud-categorias`
  - `crud-fornecedores`
  - `crud-produtos`
  - `crud-produtos-front`
  - `movimentacoes`
  - `usuarios-admin`
  - `usuarios-frontend`
  - `eduardo/sprint4-backend-multitenant-auth`
  - `eduardo/sprint4-auth-tests`
  - `eduardo/sprint4-frontend-auth-multiempresa`
  - `eduardo/sprint4-swagger-auth-usuarios`

Fluxo utilizado:

1. criar branch da funcionalidade
2. implementar modulo isoladamente
3. integrar em branch principal de desenvolvimento
4. consolidar em `main` para entrega

## Registro de sprints

| Sprint | Objetivo principal | Evidencias no repositorio | Resultado |
| --- | --- | --- | --- |
| Sprint 1 | Setup do projeto, autenticacao e fundacao do dominio | `setup-projeto`, `auth-backend`, `auth-frontend`, `entidades-base`, `entidades-estoque` | backend/frontend estruturados com JWT, entidades, migrations e layout inicial |
| Sprint 2 | CRUD de categorias, fornecedores e produtos | `crud-categorias`, `crud-fornecedores`, `crud-produtos`, `crud-produtos-front` | cadastros completos com persistencia em banco |
| Sprint 3 | Movimentacoes, estoque, usuarios e dashboard | `movimentacoes`, `usuarios-admin`, `usuarios-frontend` | movimentacao de estoque, dashboard, perfis de usuario e websocket |
| Sprint 4 | Fechamento final, testes, swagger, multiempresa e refinamentos | `eduardo/sprint4-*`, commits finais na `main` | cobertura de testes ampliada, swagger finalizado, login multiempresa, i18n, tema e ajuste de UX |

## Evidencias de uso do GitHub

- historico com branches remotas por modulo e sprint
- separacao de responsabilidades por membro no README
- consolidacao das features por integracao progressiva
- uso de `develop` e `main` como linhas de referencia do projeto

## Entrega TDE

Os itens desta pasta sao os artefatos de apoio para a entrega final:

- requisitos funcionais e user stories
- plano de testes e criterios de qualidade
- cenarios BDD
- diagramas UML dos principais fluxos

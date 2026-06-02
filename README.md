# 📦 SmartStock — Sistema de Gestão de Estoque

Sistema completo de gestão de estoque desenvolvido com **Spring Boot** (backend) e **React + TypeScript** (frontend).

## 🛠️ Tecnologias

### Backend
- **Java 17** + **Spring Boot 3.2**
- Spring Security + JWT
- Spring Data JPA + MySQL
- Flyway (migrações)
- SpringDoc OpenAPI (Swagger)
- WebSocket (STOMP)
- Lombok

### Frontend
- **React 18** + **TypeScript 5**
- Vite 5
- Tailwind CSS 3
- React Router DOM 6
- React Hook Form + Zod
- TanStack React Query
- Recharts (gráficos)
- i18next (internacionalização pt-BR / en-US)
- Framer Motion (animações)

## 🚀 Como Executar

### Pré-requisitos
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.9+

### Backend
```bash
cd backend
mvn spring-boot:run
```
> API disponível em `http://localhost:8080`
> Swagger UI em `http://localhost:8080/swagger-ui.html`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
> App disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
├── backend/           # API Spring Boot
│   ├── src/main/java/com/gestaoestoque/
│   │   ├── config/        # Configurações (CORS, Security, WebSocket, OpenAPI)
│   │   ├── controller/    # REST Controllers
│   │   ├── dto/           # Request/Response DTOs
│   │   ├── entity/        # Entidades JPA
│   │   ├── enums/         # Enumerações (Perfil, TipoMovimentacao)
│   │   ├── exception/     # Exceções customizadas
│   │   ├── repository/    # Repositories JPA
│   │   ├── security/      # JWT + Spring Security
│   │   └── service/       # Regras de negócio
│   └── src/main/resources/
│       ├── application*.yml   # Configurações por profile
│       └── db/migration/      # Scripts Flyway
├── frontend/          # App React
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── contexts/      # React Contexts (Auth, Theme)
│       ├── hooks/         # Custom hooks
│       ├── i18n/          # Internacionalização
│       ├── pages/         # Páginas da aplicação
│       ├── services/      # Serviços API (Axios)
│       ├── types/         # Tipos TypeScript
│       └── utils/         # Funções utilitárias
├── docs/              # Documentacao de processo, BDD e UML
│   ├── 01-sprints-e-gitflow.md
│   ├── 02-requisitos-e-user-stories.md
│   ├── 03-plano-de-testes-e-qualidade.md
│   ├── 04-banco-avancado.md
│   ├── features/
│   └── uml/
└── README.md
```

## 👥 Equipe

| Membro | Responsabilidade |
|--------|-----------------|
| Eduardo Pereira | Autenticação + Usuários |
| Matheus Fraiz | Categorias + Fornecedores + Movimentações |
| Patrick de Oliveira | Produtos + Dashboard + Estoque |

## 📋 Versionamento

- `v0.1.0` — Setup + Auth (Sprint 1)
- `v0.2.0` — CRUDs (Sprint 2)
- `v0.3.0` — Movimentações + Dashboard (Sprint 3)
- `v1.0.0` — Release final com testes e docs (Sprint 4)

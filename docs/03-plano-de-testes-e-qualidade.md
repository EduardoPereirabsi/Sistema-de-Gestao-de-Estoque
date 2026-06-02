# Plano de Testes e Qualidade

## Objetivo

Garantir que o sistema SmartStock atenda os requisitos funcionais, as regras de negocio e os criterios de qualidade definidos para a entrega final.

## Criterios de qualidade adotados

1. seguranca por JWT e perfis
2. isolamento por empresa
3. respostas HTTP coerentes
4. mensagens de erro claras
5. integridade do estoque
6. dashboard consistente com os dados persistidos
7. frontend com feedback visual, tema e suporte a idioma

## Estrategia de testes

### Backend

- testes unitarios de services com JUnit 5 e Mockito
- validacao de autenticacao, usuarios, painel, categorias, fornecedores, produtos e movimentacoes
- verificacao de erros de negocio:
  - email duplicado
  - usuario nao encontrado
  - token invalido
  - estoque insuficiente

Arquivos de evidencia:

- `backend/src/test/java/com/gestaoestoque/service/AutenticacaoServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/UsuarioServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/ProdutoServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/CategoriaServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/FornecedorServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/PainelServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/service/MovimentacaoEstoqueServiceTest.java`
- `backend/src/test/java/com/gestaoestoque/security/JwtTokenProviderTest.java`

### Frontend

- testes com Vitest + Testing Library
- cobertura de AuthContext, Layout, Header, Sidebar, API service e paginas principais
- validacao de:
  - redirecionamento por autenticacao
  - exibicao de mensagens
  - troca de idioma
  - troca de tema
  - renderizacao do dashboard e grafico

Arquivos de evidencia:

- `frontend/src/__tests__/App.test.tsx`
- `frontend/src/__tests__/AuthContext.test.tsx`
- `frontend/src/__tests__/ThemeContext.test.tsx`
- `frontend/src/components/layout/__tests__/Header.test.tsx`
- `frontend/src/components/layout/__tests__/Layout.test.tsx`
- `frontend/src/components/layout/__tests__/Sidebar.test.tsx`
- `frontend/src/pages/__tests__/LoginPage.test.tsx`
- `frontend/src/pages/__tests__/PainelPage.test.tsx`
- `frontend/src/pages/__tests__/ProdutosPage.test.tsx`
- `frontend/src/pages/__tests__/UsuariosPage.test.tsx`

## Cenarios BDD

Os cenarios de negocio foram registrados em:

- `docs/features/autenticacao-multiempresa.feature`
- `docs/features/movimentacao-estoque.feature`

## Matriz resumida

| Historia | Critico | Tipo de validacao | Evidencia |
| --- | --- | --- | --- |
| US01 Autenticacao | Alto | automatizado backend/frontend | AuthContext, AutenticacaoService |
| US02 Login multiempresa | Alto | automatizado + fluxo manual | LoginPage, AutenticacaoService |
| US03 Categorias | Medio | automatizado backend + UI | CategoriaService, CategoriasPage |
| US04 Fornecedores | Medio | automatizado backend + UI | FornecedorService, FornecedoresPage |
| US05 Produtos | Alto | automatizado backend + UI | ProdutoService, ProdutosPage |
| US06 Movimentacao | Alto | automatizado backend + UI | MovimentacaoEstoqueService, MovimentacoesPage |
| US07 Dashboard | Alto | automatizado backend + UI | PainelService, PainelPage |
| US08 Usuarios | Alto | automatizado backend + UI | UsuarioService, UsuariosPage |

## Criterios de aceite para entrega

- build do frontend concluindo com sucesso
- backend com controllers documentados e tratamento global de erros
- dashboard carregando cards, estoque baixo e grafico diario
- autenticacao protegendo rotas e retornando os status esperados
- responsividade basica com menu lateral mobile e modo escuro

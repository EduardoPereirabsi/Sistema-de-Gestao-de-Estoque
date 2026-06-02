# Requisitos e User Stories

## Requisitos funcionais

RF01. O sistema deve permitir cadastro de empresa e usuario administrador inicial.  
RF02. O sistema deve autenticar usuarios com JWT.  
RF03. O sistema deve permitir login em empresas diferentes quando o mesmo email existir em mais de uma empresa.  
RF04. O sistema deve permitir CRUD de categorias por empresa.  
RF05. O sistema deve permitir CRUD de fornecedores por empresa.  
RF06. O sistema deve permitir CRUD de produtos por empresa.  
RF07. O sistema deve registrar movimentacoes de estoque do tipo entrada, saida e ajuste.  
RF08. O sistema deve bloquear saidas com estoque insuficiente.  
RF09. O sistema deve exibir dashboard com resumo do estoque e grafico diario.  
RF10. O sistema deve permitir gestao de usuarios por perfil.  
RF11. O sistema deve enviar alerta de estoque baixo por WebSocket.  
RF12. O frontend deve suportar tema claro/escuro e mudanca de idioma.

## Regras de negocio

RN01. Usuarios enxergam somente dados da propria empresa.  
RN02. Email de usuario deve ser unico dentro da empresa.  
RN03. Apenas `ADMIN` pode gerenciar usuarios.  
RN04. `ADMIN` e `GERENTE` podem alterar produtos, categorias e fornecedores.  
RN05. `OPERADOR` pode consultar estoque e registrar movimentacoes.  
RN06. Quando o estoque ficar abaixo do minimo, o sistema deve alertar o frontend.  
RN07. O proprio administrador nao pode desativar a propria conta.  
RN08. O dashboard deve consolidar totais por empresa autenticada.

## User stories

### US01 - Autenticacao
Como usuario, quero entrar no sistema com email e senha para acessar apenas os recursos permitidos ao meu perfil.

Criterios de aceite:

- ao informar credenciais validas, recebo `accessToken`, `refreshToken` e dados do usuario
- ao informar credenciais invalidas, recebo erro `401`
- ao tentar acessar rota protegida sem token, o acesso deve ser negado

### US02 - Login multiempresa
Como usuario vinculado a mais de uma empresa, quero escolher a empresa de acesso apos validar minhas credenciais.

Criterios de aceite:

- o backend retorna a lista de empresas quando o email pertence a mais de uma empresa
- o frontend solicita a escolha da empresa antes de concluir o login
- a sessao final fica vinculada a empresa selecionada

### US03 - Gerenciar categorias
Como gerente, quero cadastrar e editar categorias para organizar os produtos.

Criterios de aceite:

- nome da categoria eh obrigatorio
- o cadastro fica isolado por empresa
- o CRUD responde com status HTTP coerente

### US04 - Gerenciar fornecedores
Como gerente, quero manter fornecedores para relacionar compras e produtos.

Criterios de aceite:

- nome do fornecedor eh obrigatorio
- os dados ficam separados por empresa
- o sistema informa erros de validacao e persistencia

### US05 - Gerenciar produtos
Como gerente, quero cadastrar produtos com categoria, fornecedor, preco e estoque minimo.

Criterios de aceite:

- SKU deve ser unico por empresa
- produto pode ser consultado, editado e removido
- dashboard e estoque devem refletir o cadastro

### US06 - Movimentar estoque
Como operador, quero registrar entradas, saidas e ajustes para manter o estoque atualizado.

Criterios de aceite:

- saida nao pode exceder o estoque disponivel
- ajuste redefine a quantidade do produto
- toda movimentacao registra usuario, produto, tipo e motivo

### US07 - Dashboard
Como gestor, quero visualizar totais e tendencias de movimentacao para acompanhar a operacao.

Criterios de aceite:

- o painel mostra totais de produtos, categorias, fornecedores e valor de estoque
- o painel mostra produtos com estoque baixo
- o painel mostra grafico diario de entradas, saidas e ajustes

### US08 - Gerenciar usuarios
Como administrador, quero criar, atualizar e ativar/desativar usuarios para controlar acessos.

Criterios de aceite:

- apenas administrador acessa o modulo de usuarios
- o sistema respeita perfis `ADMIN`, `GERENTE` e `OPERADOR`
- a troca de status nao pode desativar o proprio usuario logado

## Como os requisitos foram usados

Os requisitos acima serviram de base para:

- implementacao dos controllers e services no backend
- definicao de rotas protegidas no frontend
- criacao dos testes de autenticacao, usuarios, produtos, fornecedores, categorias, painel e movimentacao
- elaboracao dos cenarios BDD e diagramas UML desta pasta

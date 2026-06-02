Feature: Autenticacao multiempresa
  Como usuario do sistema
  Quero autenticar com JWT
  Para acessar somente os dados da empresa selecionada

  Scenario: Login com uma unica empresa
    Given que existe um usuario ativo vinculado a uma empresa
    When ele informa email e senha validos
    Then o backend retorna access token, refresh token e dados do usuario

  Scenario: Login com mais de uma empresa
    Given que o mesmo email esta vinculado a mais de uma empresa
    When o usuario informa email e senha validos sem empresa selecionada
    Then o backend retorna a lista de empresas disponiveis
    And o frontend solicita a selecao da empresa

  Scenario: Credenciais invalidas
    Given que o usuario informa uma senha incorreta
    When a autenticacao eh processada
    Then o backend retorna status 401
    And o frontend mostra uma mensagem de erro amigavel

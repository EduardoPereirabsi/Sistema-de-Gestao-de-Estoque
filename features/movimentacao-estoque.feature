Feature: Movimentacao de estoque
  Como operador
  Quero registrar entradas, saidas e ajustes
  Para manter o estoque correto e receber alertas de risco

  Scenario: Registrar entrada
    Given que existe um produto valido na empresa atual
    When o usuario registra uma movimentacao de entrada
    Then o estoque do produto aumenta
    And a movimentacao fica registrada com usuario, tipo e motivo

  Scenario: Bloquear saida sem estoque suficiente
    Given que um produto possui quantidade menor que a solicitada
    When o usuario tenta registrar uma saida
    Then o backend retorna erro de estoque insuficiente
    And o estoque do produto nao eh alterado

  Scenario: Alertar estoque baixo
    Given que a saida deixa o produto abaixo do estoque minimo
    When a movimentacao eh concluida
    Then o backend envia um evento para o topico de websocket
    And o frontend mostra alerta visual ao usuario

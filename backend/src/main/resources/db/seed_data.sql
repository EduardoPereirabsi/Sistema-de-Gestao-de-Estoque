-- =============================================================
-- Seed SmartStock — categorias, fornecedores, produtos e movimentações
-- Pré-requisito: empresa ID=1 (SmartStock) e usuário ID=1 já criados via sistema
-- =============================================================

USE gestao_estoque;

-- ---------------------------------------------------------------
-- CATEGORIAS
-- ---------------------------------------------------------------
INSERT INTO CATEGORIAS (EMPRESA_ID, NOME, DESCRICAO, ATIVO) VALUES
(1, 'Eletrônicos',        'Computadores, monitores e componentes',     TRUE),
(1, 'Periféricos',        'Teclados, mouses, headsets e webcams',      TRUE),
(1, 'Cabos e Adaptadores','Cabos USB, HDMI, adaptadores diversos',     TRUE),
(1, 'Armazenamento',      'SSDs, HDs externos e pen drives',           TRUE),
(1, 'Redes',              'Roteadores, switches e cabos de rede',      TRUE),
(1, 'Impressão',          'Impressoras, cartuchos e suprimentos',      TRUE);

-- ---------------------------------------------------------------
-- FORNECEDORES
-- ---------------------------------------------------------------
INSERT INTO FORNECEDORES (EMPRESA_ID, NOME, CNPJ, EMAIL, TELEFONE, ENDERECO, ATIVO) VALUES
(1, 'Samsung Brasil',      '00.280.273/0001-37', 'vendas@samsung.com.br',      '(11) 4004-0001', 'Av. Paulista, 1000 - São Paulo/SP',       TRUE),
(1, 'Logitech BR',         '07.175.004/0001-55', 'contato@logitech.com.br',    '(11) 4004-0002', 'Rua Augusta, 500 - São Paulo/SP',         TRUE),
(1, 'Kingston Technology', '10.548.228/0001-19', 'suporte@kingston.com.br',    '(11) 4004-0003', 'Rua Vergueiro, 200 - São Paulo/SP',       TRUE),
(1, 'TP-Link Brasil',      '14.571.108/0001-04', 'vendas@tplink.com.br',       '(11) 4004-0004', 'Av. das Nações Unidas, 3000 - SP/SP',    TRUE),
(1, 'HP Brasil',           '61.797.924/0001-55', 'comercial@hp.com.br',        '(11) 4004-0005', 'Rua Funchal, 418 - São Paulo/SP',         TRUE);

-- ---------------------------------------------------------------
-- PRODUTOS
-- ---------------------------------------------------------------
INSERT INTO PRODUTOS (EMPRESA_ID, CATEGORIA_ID, FORNECEDOR_ID, NOME, SKU, DESCRICAO, PRECO, PRECO_CUSTO, QUANTIDADE, QUANTIDADE_MINIMA, ATIVO) VALUES
-- Eletrônicos (categoria 7)
(1,  7, 1, 'Monitor Samsung 24" Full HD',    'MON-SAM-24FHD', 'Monitor LED 24" 1080p HDMI/VGA 75Hz',          1299.90,  780.00, 15,  5, TRUE),
(1,  7, 1, 'Monitor Samsung 27" QHD',        'MON-SAM-27QHD', 'Monitor IPS 27" 2560x1440 HDMI/DP 144Hz',      2799.90, 1650.00,  8,  3, TRUE),
(1,  7, 1, 'Notebook Samsung Book',          'NOT-SAM-BOOK',  'Notebook 15.6" Core i5 8GB 256GB SSD Win 11',  3499.90, 2100.00,  5,  2, TRUE),
-- Periféricos (categoria 8)
(1,  8, 2, 'Teclado Logitech MK270 Sem Fio', 'TEC-LOG-MK270', 'Teclado sem fio ABNT2 2.4GHz',                  199.90,  110.00, 30, 10, TRUE),
(1,  8, 2, 'Mouse Logitech M170 Sem Fio',    'MOU-LOG-M170',  'Mouse sem fio 2.4GHz 1000 DPI',                  79.90,   38.00, 45, 15, TRUE),
(1,  8, 2, 'Headset Logitech H390 USB',      'HDS-LOG-H390',  'Headset USB com microfone e controle de volume', 229.90,  130.00,  4, 10, TRUE),
(1,  8, 2, 'Webcam Logitech C920 HD',        'WEB-LOG-C920',  'Webcam Full HD 1080p 30fps USB',                 549.90,  320.00,  6,  5, TRUE),
-- Cabos e Adaptadores (categoria 9)
(1,  9, 1, 'Cabo HDMI 2m 4K',               'CAB-HDMI-2M',   'Cabo HDMI 2.0 4K 60Hz 2 metros',                 39.90,   15.00, 80, 20, TRUE),
(1,  9, 1, 'Cabo USB-C 1m',                 'CAB-USBC-1M',   'Cabo USB-C para USB-A 3.0 1 metro',               29.90,   10.00, 60, 20, TRUE),
(1,  9, 1, 'Adaptador USB-C para HDMI',     'ADP-USBC-HDMI', 'Adaptador USB-C macho para HDMI fêmea 4K',        89.90,   40.00, 25, 10, TRUE),
(1,  9, 1, 'Hub USB 4 Portas',              'HUB-USB-4P',    'Hub USB 3.0 com 4 portas alimentado',             79.90,   35.00,  3, 10, TRUE),
-- Armazenamento (categoria 10)
(1, 10, 3, 'SSD Kingston A400 480GB',       'SSD-KNG-480',   'SSD SATA III 480GB até 500MB/s leitura',         289.90,  170.00, 12,  5, TRUE),
(1, 10, 3, 'SSD Kingston NV2 1TB M.2',      'SSD-KNG-1TB',   'SSD M.2 NVMe 1TB até 3500MB/s',                 489.90,  290.00,  7,  3, TRUE),
(1, 10, 3, 'Pen Drive Kingston 64GB USB3',  'PEN-KNG-64',    'Pen Drive USB 3.2 Gen 1 64GB',                    49.90,   20.00, 55, 20, TRUE),
(1, 10, 3, 'HD Externo Kingston 1TB',       'HDE-KNG-1TB',   'HD Externo USB 3.0 1TB portátil',                319.90,  185.00,  2,  5, TRUE),
-- Redes (categoria 11)
(1, 11, 4, 'Roteador TP-Link Archer AX23',  'ROT-TPL-AX23',  'Roteador Wi-Fi 6 AX1800 Dual Band',              499.90,  290.00, 10,  4, TRUE),
(1, 11, 4, 'Switch TP-Link 8 Portas',       'SWT-TPL-8P',    'Switch Gigabit não gerenciável 8 portas',        199.90,  110.00, 14,  5, TRUE),
(1, 11, 4, 'Cabo de Rede Cat6 10m',         'CAB-CAT6-10M',  'Cabo de rede Cat6 UTP 10 metros c/ conectores',   29.90,   10.00, 40, 15, TRUE),
-- Impressão (categoria 12)
(1, 12, 5, 'Impressora HP DeskJet 2876',    'IMP-HP-2876',   'Impressora multifuncional Wi-Fi jato de tinta',  549.90,  320.00,  0,  3, TRUE),
(1, 12, 5, 'Cartucho HP 664 Preto',         'CAR-HP-664P',   'Cartucho de tinta HP 664 preto original',         59.90,   28.00,  8, 10, TRUE),
(1, 12, 5, 'Cartucho HP 664 Colorido',      'CAR-HP-664C',   'Cartucho de tinta HP 664 colorido original',      69.90,   33.00,  5, 10, TRUE);

-- ---------------------------------------------------------------
-- MOVIMENTAÇÕES DE ESTOQUE
-- ---------------------------------------------------------------
INSERT INTO MOVIMENTACOES_ESTOQUE (EMPRESA_ID, PRODUTO_ID, USUARIO_ID, TIPO, QUANTIDADE, MOTIVO) VALUES
-- Entradas iniciais (todos os produtos)
(1, 22, 1, 'ENTRADA',  20, 'Compra inicial de estoque'),
(1, 23, 1, 'ENTRADA',  12, 'Compra inicial de estoque'),
(1, 24, 1, 'ENTRADA',   8, 'Compra inicial de estoque'),
(1, 25, 1, 'ENTRADA',  50, 'Compra inicial de estoque'),
(1, 26, 1, 'ENTRADA',  70, 'Compra inicial de estoque'),
(1, 27, 1, 'ENTRADA',  15, 'Compra inicial de estoque'),
(1, 28, 1, 'ENTRADA',  10, 'Compra inicial de estoque'),
(1, 29, 1, 'ENTRADA', 120, 'Compra em volume'),
(1, 30, 1, 'ENTRADA',  90, 'Compra em volume'),
(1, 31, 1, 'ENTRADA',  40, 'Compra inicial de estoque'),
(1, 32, 1, 'ENTRADA',  20, 'Compra inicial de estoque'),
(1, 33, 1, 'ENTRADA',  20, 'Compra inicial de estoque'),
(1, 34, 1, 'ENTRADA',  10, 'Compra inicial de estoque'),
(1, 35, 1, 'ENTRADA',  80, 'Compra em volume'),
(1, 36, 1, 'ENTRADA',  10, 'Compra inicial de estoque'),
(1, 37, 1, 'ENTRADA',  15, 'Compra inicial de estoque'),
(1, 38, 1, 'ENTRADA',  20, 'Compra inicial de estoque'),
(1, 39, 1, 'ENTRADA',  60, 'Compra em volume'),
(1, 40, 1, 'ENTRADA',   5, 'Compra inicial de estoque'),
(1, 41, 1, 'ENTRADA',  20, 'Compra inicial de estoque'),
(1, 42, 1, 'ENTRADA',  15, 'Compra inicial de estoque'),
-- Saídas (vendas)
(1, 22, 1, 'SAIDA',  5, 'Venda para cliente PJ'),
(1, 23, 1, 'SAIDA',  4, 'Venda para escritório'),
(1, 24, 1, 'SAIDA',  3, 'Venda para cliente PJ'),
(1, 25, 1, 'SAIDA', 20, 'Venda varejo'),
(1, 26, 1, 'SAIDA', 25, 'Venda varejo'),
(1, 27, 1, 'SAIDA', 11, 'Venda para home office — estoque crítico'),
(1, 28, 1, 'SAIDA',  4, 'Venda para cliente PJ'),
(1, 29, 1, 'SAIDA', 40, 'Venda em atacado'),
(1, 30, 1, 'SAIDA', 30, 'Venda varejo'),
(1, 31, 1, 'SAIDA', 15, 'Venda varejo'),
(1, 32, 1, 'SAIDA', 17, 'Venda varejo — estoque crítico'),
(1, 33, 1, 'SAIDA',  8, 'Venda para cliente PJ'),
(1, 34, 1, 'SAIDA',  3, 'Venda varejo'),
(1, 35, 1, 'SAIDA', 25, 'Venda em atacado'),
(1, 36, 1, 'SAIDA',  8, 'Venda varejo — estoque crítico'),
(1, 37, 1, 'SAIDA',  5, 'Venda varejo'),
(1, 38, 1, 'SAIDA',  6, 'Venda para escritório'),
(1, 39, 1, 'SAIDA', 20, 'Venda atacado'),
(1, 40, 1, 'SAIDA',  5, 'Venda varejo — estoque zerado'),
(1, 41, 1, 'SAIDA', 12, 'Venda varejo'),
(1, 42, 1, 'SAIDA', 10, 'Venda varejo'),
-- Ajustes de inventário
(1, 26, 1, 'AJUSTE',  5, 'Reposição de estoque — lote extra recebido'),
(1, 30, 1, 'AJUSTE', -1, 'Avaria no transporte — produto danificado');

SELECT CONCAT(
    'Seed concluído! | Categorias: ', (SELECT COUNT(*) FROM CATEGORIAS WHERE EMPRESA_ID = 1),
    ' | Fornecedores: ',              (SELECT COUNT(*) FROM FORNECEDORES WHERE EMPRESA_ID = 1),
    ' | Produtos: ',                  (SELECT COUNT(*) FROM PRODUTOS WHERE EMPRESA_ID = 1),
    ' | Movimentações: ',             (SELECT COUNT(*) FROM MOVIMENTACOES_ESTOQUE WHERE EMPRESA_ID = 1)
) AS resumo;

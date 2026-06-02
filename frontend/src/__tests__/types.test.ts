import { describe, it, expect } from 'vitest';
import type {
  Usuario,
  Categoria,
  Produto,
  AutenticacaoResponse,
  PainelResponse,
  PageResponse,
  EmpresaAutenticacao,
  Movimentacao,
} from '../types';

describe('Types', () => {
  it('Usuario deve refletir os campos atuais da autenticacao', () => {
    const usuario: Usuario = {
      id: 1,
      nome: 'Maria',
      email: 'maria@empresa.com',
      perfil: 'ADMIN',
      ativo: true,
      nomeEmpresa: 'Empresa X',
      criadoEm: '2026-06-02T10:00:00',
    };

    expect(usuario.perfil).toBe('ADMIN');
  });

  it('Produto deve aceitar categoria e fornecedor opcionais', () => {
    const produto: Produto = {
      id: 1,
      nome: 'Mouse',
      sku: 'MOU-001',
      preco: 99.9,
      quantidade: 5,
      quantidadeMinima: 2,
      estoqueAbaixo: false,
      categoria: undefined,
      fornecedor: undefined,
    };

    expect(produto.fornecedor).toBeUndefined();
  });

  it('AutenticacaoResponse deve aceitar empresas quando houver login multiempresa', () => {
    const empresas: EmpresaAutenticacao[] = [
      { id: 1, nome: 'Empresa A' },
      { id: 2, nome: 'Empresa B' },
    ];
    const resposta: AutenticacaoResponse = { empresas };

    expect(resposta.empresas).toHaveLength(2);
  });

  it('PainelResponse deve refletir o resumo do dashboard', () => {
    const painel: PainelResponse = {
      totalProdutos: 10,
      totalCategorias: 4,
      totalFornecedores: 3,
      valorTotalEstoque: 5000,
      produtosAbaixoMinimo: 2,
      movimentacoesMes: 12,
    };

    expect(painel.totalProdutos).toBe(10);
  });

  it('PageResponse deve funcionar com categorias e movimentacoes', () => {
    const categorias: PageResponse<Categoria> = {
      content: [{ id: 1, nome: 'Eletronicos', descricao: 'Produtos eletronicos' }],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 20,
    };

    const movimentacao: Movimentacao = {
      id: 1,
      nomeProduto: 'Mouse',
      skuProduto: 'MOU-001',
      nomeUsuario: 'Maria',
      tipo: 'ENTRADA',
      quantidade: 10,
      criadoEm: '2026-06-02T10:00:00',
    };

    expect(categorias.content[0].nome).toBe('Eletronicos');
    expect(movimentacao.tipo).toBe('ENTRADA');
  });
});

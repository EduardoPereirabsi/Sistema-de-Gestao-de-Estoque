export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'OPERADOR';
  ativo: boolean;
  nomeEmpresa: string;
  criadoEm?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  criadoEm?: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  criadoEm?: string;
}

export interface Produto {
  id: number;
  nome: string;
  sku: string;
  descricao?: string;
  preco: number;
  precoCusto?: number;
  quantidade: number;
  quantidadeMinima: number;
  urlImagem?: string;
  estoqueAbaixo: boolean;
  categoria?: Categoria;
  fornecedor?: Fornecedor;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface Movimentacao {
  id: number;
  nomeProduto: string;
  skuProduto: string;
  nomeUsuario: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  motivo?: string;
  criadoEm: string;
}

export interface AutenticacaoResponse {
  accessToken?: string;
  refreshToken?: string;
  usuario?: Usuario;
  empresas?: Empresa[];
}

export interface PainelResponse {
  totalProdutos: number;
  totalCategorias: number;
  totalFornecedores: number;
  valorTotalEstoque: number;
  produtosAbaixoMinimo: number;
  movimentacoesMes: number;
}

export interface GraficoDiario {
  data: string;
  entradas: number;
  saidas: number;
  ajustes: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
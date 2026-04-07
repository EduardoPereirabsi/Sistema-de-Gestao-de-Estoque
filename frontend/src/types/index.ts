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
   empresa: Empresa;
 }
 
 export interface Categoria {
   id: number;
   nome: string;
   descricao?: string;
   ativo: boolean;
 }
 
 export interface Fornecedor {
   id: number;
   nome: string;
   cnpj?: string;
   email?: string;
   telefone?: string;
   ativo: boolean;
 }
 
 export interface Produto {
   id: number;
   nome: string;
   descricao?: string;
   sku?: string;
   preco: number;
   quantidade: number;
   estoqueMinimo: number;
   ativo: boolean;
   categoria?: Categoria;
   fornecedor?: Fornecedor;
 }
 
 export interface Movimentacao {
   id: number;
   produto: Produto;
   tipo: 'ENTRADA' | 'SAIDA';
   quantidade: number;
   observacao?: string;
   criadoEm: string;
   usuario: Usuario;
 }
 
 export interface PainelResponse {
   totalProdutos: number;
   totalCategorias: number;
   totalFornecedores: number;
   produtosAbaixoMinimo: number;
   entradasHoje: number;
   saidasHoje: number;
   grafico: GraficoDiario[];
 }
 
 export interface GraficoDiario {
   data: string;
   entradas: number;
   saidas: number;
 }

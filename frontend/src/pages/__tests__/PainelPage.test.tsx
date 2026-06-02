import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PainelPage from '../PainelPage';
import i18n from '../../i18n';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div data-testid="chart">{children}</div>,
  BarChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '../../services/api';

describe('PainelPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage('pt-BR');
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url === '/api/dashboard/painel') {
        return Promise.resolve({
          data: {
            totalProdutos: 8,
            totalCategorias: 2,
            totalFornecedores: 1,
            valorTotalEstoque: 1200.5,
            produtosAbaixoMinimo: 1,
            movimentacoesMes: 7,
          },
        } as never);
      }
      if (url === '/api/dashboard/grafico-diario?dias=7') {
        return Promise.resolve({
          data: [{ data: '02/06', entradas: 3, saidas: 1, ajustes: 0 }],
        } as never);
      }
      if (url === '/api/products/low-stock') {
        return Promise.resolve({
          data: [{ id: 1, nome: 'Mouse', sku: 'MOU-001', quantidade: 2, quantidadeMinima: 5, estoqueAbaixo: true, preco: 10 }],
        } as never);
      }
      throw new Error(`URL não mockada: ${url}`);
    });
  });

  it('deve renderizar cards, grafico e lista de estoque baixo', async () => {
    render(<PainelPage />);

    expect(await screen.findByText('Total de Produtos')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /7 Dias/i })).toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Estoque Baixo/i })).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('deve traduzir o painel para ingles', async () => {
    await i18n.changeLanguage('en-US');

    render(<PainelPage />);

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Movements - Last 7 Days')).toBeInTheDocument();
  });
});

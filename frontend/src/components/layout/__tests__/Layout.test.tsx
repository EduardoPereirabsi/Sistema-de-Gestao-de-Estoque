import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

const mockUseWebSocket = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Conteudo</div>,
  };
});

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../../hooks/useWebSocket', () => ({
  useWebSocket: () => mockUseWebSocket(),
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar sidebar, header e outlet', () => {
    render(<Layout />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('deve inicializar o hook de websocket', () => {
    render(<Layout />);

    expect(mockUseWebSocket).toHaveBeenCalledTimes(1);
  });
});

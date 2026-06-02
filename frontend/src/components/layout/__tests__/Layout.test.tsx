import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  default: ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
    <button data-testid="sidebar" data-open={String(open)} onClick={onToggle}>Sidebar</button>
  ),
}));

vi.mock('../Header', () => ({
  default: ({ onMenuToggle }: { onMenuToggle: () => void }) => (
    <button data-testid="header" onClick={onMenuToggle}>Header</button>
  ),
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

  it('deve controlar a abertura da sidebar pelo header', async () => {
    render(<Layout />);

    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');

    await userEvent.click(screen.getByTestId('header'));
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'true');

    await userEvent.click(screen.getByTestId('sidebar'));
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');
  });
});

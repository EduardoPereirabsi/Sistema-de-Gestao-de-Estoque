import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('deve iniciar com tema light por padrao', () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('deve carregar tema do localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeProvider><TestComponent /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('deve alternar entre light e dark', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
    await act(async () => { await userEvent.click(screen.getByTestId('toggle')); });
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    await act(async () => { await userEvent.click(screen.getByTestId('toggle')); });
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('deve salvar tema no localStorage', async () => {
    render(<ThemeProvider><TestComponent /></ThemeProvider>);
    await act(async () => { await userEvent.click(screen.getByTestId('toggle')); });
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('useTheme deve lancar erro fora do Provider', () => {
    function Bad() { useTheme(); return null; }
    expect(() => render(<Bad />)).toThrow('useTheme must be used within ThemeProvider');
  });
});

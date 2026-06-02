import { describe, it, expect } from 'vitest';
import {
  formatarMoeda,
  formatarData,
  formatarDataHora,
  formatarCNPJ,
  classeStatus,
} from '../utils';

describe('utils', () => {
  it('deve formatar moeda em BRL', () => {
    expect(formatarMoeda(1234.56)).toContain('1.234,56');
  });

  it('deve formatar data em pt-BR', () => {
    expect(formatarData('2024-06-15T10:30:00')).toMatch(/15\/06\/2024/);
  });

  it('deve formatar data e hora em pt-BR', () => {
    expect(formatarDataHora('2024-06-15T10:30:00')).toContain('15/06/2024');
  });

  it('deve formatar CNPJ numerico', () => {
    expect(formatarCNPJ('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('deve retornar classes corretas para status', () => {
    expect(classeStatus(true)).toBe('bg-green-100 text-green-700');
    expect(classeStatus(false)).toBe('bg-red-100 text-red-700');
  });
});

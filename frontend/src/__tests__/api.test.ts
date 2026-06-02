import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

describe('API Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve ter Content-Type json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('request interceptor deve adicionar token', async () => {
    localStorage.setItem('accessToken', 'test-token');

    const interceptor = api.interceptors.request.handlers?.[0]?.fulfilled;
    expect(interceptor).toBeTypeOf('function');

    const config = await interceptor!({ headers: {} } as any);
    expect(config.headers.Authorization).toBe('Bearer test-token');
  });

  it('request interceptor nao deve adicionar token quando nao existe', async () => {
    const interceptor = api.interceptors.request.handlers?.[0]?.fulfilled;
    expect(interceptor).toBeTypeOf('function');

    const config = await interceptor!({ headers: {} } as any);
    expect(config.headers.Authorization).toBeUndefined();
  });
});

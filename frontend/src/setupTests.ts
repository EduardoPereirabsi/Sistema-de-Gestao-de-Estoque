import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import i18n from './i18n';

beforeEach(async () => {
  localStorage.removeItem('i18nextLng');
  localStorage.removeItem('theme');
  document.documentElement.classList.remove('light', 'dark');
  await i18n.changeLanguage('pt-BR');
});

if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    }),
  });
}

if (typeof window.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

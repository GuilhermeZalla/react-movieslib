import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

afterEach(() => {
  vi.useRealTimers();
});

it('publica só o último valor após 300 ms e reinicia ao digitar', () => {
  vi.useFakeTimers();
  const view = renderHook(({ value }) => useDebouncedValue(value), {
    initialProps: { value: '' },
  });
  view.rerender({ value: 'Fil' });
  act(() => {
    vi.advanceTimersByTime(200);
  });
  view.rerender({ value: 'Filme' });
  act(() => {
    vi.advanceTimersByTime(299);
  });
  expect(view.result.current).toBe('');
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(view.result.current).toBe('Filme');
  view.rerender({ value: '' });
  act(() => {
    vi.advanceTimersByTime(300);
  });
  expect(view.result.current).toBe('');
});

it('desmontar limpa o timer pendente', () => {
  vi.useFakeTimers();
  const view = renderHook(({ value }) => useDebouncedValue(value), {
    initialProps: { value: '' },
  });
  view.rerender({ value: 'Filme' });
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

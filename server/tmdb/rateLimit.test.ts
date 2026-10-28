import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rateLimit.ts';

describe('limitador anônimo de melhor esforço por instância', () => {
  it('permite o limite e bloqueia até a próxima janela', () => {
    let now = 0;
    const allow = createRateLimiter(2, 60_000, () => now);
    expect(allow().allowed).toBe(true);
    expect(allow().allowed).toBe(true);
    expect(allow()).toEqual({ allowed: false, retryAfter: 60 });
    now = 59_000;
    expect(allow()).toEqual({ allowed: false, retryAfter: 1 });
    now = 60_000;
    expect(allow().allowed).toBe(true);
  });
  it('instâncias independentes não compartilham quota e reinício perde o contador', () => {
    const first = createRateLimiter(1);
    const second = createRateLimiter(1);
    expect(first().allowed).toBe(true);
    expect(first().allowed).toBe(false);
    expect(second().allowed).toBe(true);
  });
});

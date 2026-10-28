/** Best effort, per instance: one anonymous counter, no IPs or growing key map. */
export function createRateLimiter(
  limit = 60,
  windowMs = 60_000,
  now = Date.now,
) {
  let startedAt = now();
  let count = 0;
  return () => {
    const timestamp = now();
    if (timestamp - startedAt >= windowMs || timestamp < startedAt) {
      startedAt = timestamp;
      count = 0;
    }
    const retryAfter = Math.max(
      1,
      Math.ceil((windowMs - (timestamp - startedAt)) / 1000),
    );
    if (count >= limit) return { allowed: false, retryAfter };
    count += 1;
    return { allowed: true, retryAfter };
  };
}

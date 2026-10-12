const MAX_KEYS = 10_000;

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    hit(key: string, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      if (hits.size >= MAX_KEYS && !hits.has(key)) hits.delete(hits.keys().next().value!);
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

export function createCooldown(windowMs: number) {
  const last = new Map<string, number>();
  return {
    take(key: string, now = Date.now()) {
      const at = last.get(key);
      if (at !== undefined && now - at < windowMs) return false;
      if (last.size >= MAX_KEYS && !last.has(key)) last.delete(last.keys().next().value!);
      last.set(key, now);
      return true;
    },
    release(key: string) {
      last.delete(key);
    },
  };
}

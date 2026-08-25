export function createRateLimit({ windowMs, max, key = req => req.ip }) {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const bucketKey = String(key(req) || 'unknown');
    const current = buckets.get(bucketKey);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    bucket.count += 1;
    buckets.set(bucketKey, bucket);
    res.set('RateLimit-Limit', String(max));
    res.set('RateLimit-Remaining', String(Math.max(max - bucket.count, 0)));
    res.set('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      res.set('Retry-After', String(Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1)));
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }

    if (buckets.size > 5000) {
      for (const [storedKey, storedBucket] of buckets) {
        if (storedBucket.resetAt <= now) buckets.delete(storedKey);
      }
    }

    return next();
  };
}

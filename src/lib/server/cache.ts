const cacheStore = new Map<string, { data: string; expiry: number }>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function getCache(key: string): string | null {
	const entry = cacheStore.get(key);
	if (!entry) return null;
	if (entry.expiry < Date.now()) {
		cacheStore.delete(key);
		return null;
	}
	return entry.data;
}

export function setCache(key: string, data: string, ttl = DEFAULT_TTL): void {
	cacheStore.set(key, {
		data,
		expiry: Date.now() + ttl
	});
}

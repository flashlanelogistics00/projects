// Basic in-memory rate limiter for server actions
// Note: In serverless environments like Vercel, this will be reset frequently
// as the function container scales up/down. For production, use Redis/Upstash.

interface RateLimitStore {
    [key: string]: {
        count: number
        lastReset: number
    }
}

const store: RateLimitStore = {}

export function rateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now()

    if (!store[key]) {
        store[key] = { count: 1, lastReset: now }
        return true
    }

    const { count, lastReset } = store[key]

    if (now - lastReset > windowMs) {
        store[key] = { count: 1, lastReset: now }
        return true
    }

    if (count >= limit) {
        return false
    }

    store[key].count++
    return true
}

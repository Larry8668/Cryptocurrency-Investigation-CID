import { localRedisClient } from './InitLocalRedis';
import { upstashClient } from './InitUpstashRedis.';

const isDevMode = import.meta.env.VITE_VERCEL_DEV_MODE === 'ON';

const cacheClient = isDevMode ? localRedisClient : upstashClient;

export { cacheClient };

import { kvClient } from './InitVercelRedis';
import { localRedisClient } from './InitLocalRedis';

const isDevMode = import.meta.env.VITE_DEV_MODE === 'ON';

const cacheClient = isDevMode ? localRedisClient : kvClient;

export { cacheClient };

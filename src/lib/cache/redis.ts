import { createClient } from 'redis';

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          return new Error('Redis connection failed after 10 retries');
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

redis.on('error', (err) => console.error('Redis Client Error:', err));
redis.on('connect', () => console.log('Redis Client Connected'));
redis.on('ready', () => console.log('Redis Client Ready'));

if (!redis.isOpen) {
  redis.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
}

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export default redis;

import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  url: process.env.CACHE_URL ?? 'redis://localhost:6379',
}));

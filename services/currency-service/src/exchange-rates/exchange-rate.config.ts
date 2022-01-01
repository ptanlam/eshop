import { registerAs } from '@nestjs/config';

export default registerAs('exchangeRates', () => ({
  apiKey: process.env.EXCHANGE_RATE_API_KEY,
  url: process.env.EXCHANGE_RATE_URL,
}));

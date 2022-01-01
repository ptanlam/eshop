import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  uri: process.env.RABBIT_MQ_URI,
}));

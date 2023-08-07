import { IConfig } from 'src/interfaces/config.interface';

const config = (): IConfig => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  postgresql: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERMAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});

export default config;

interface PostgresqlConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface IConfig {
  postgresql: PostgresqlConfig;
  port: number;
}

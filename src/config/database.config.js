const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dateStrings: "date",
  connectionLimit: 100,
  maxIdle: 100,
  idleTimeout: 6000,
};

module.exports = config;

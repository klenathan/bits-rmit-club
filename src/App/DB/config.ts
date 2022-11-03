require("dotenv").config();

module.exports = {
  development: {
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    logging: false,
    dialect: "postgres",
  },
  development_local: {
    username: process.env.RDS_LOCAL_USERNAME,
    password: process.env.RDS_LOCAL_PASSWORD,
    database: process.env.RDS_LOCAL_DATABASE,
    host: process.env.RDS_LOCAL_HOST,
    logging: false,
    port: process.env.RDS_LOCAL_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.PROD_USERNAME || "root",
    password: process.env.PROD_PASSWORD || null,
    database: process.env.PROD_DATABASE || "database_production",
    host: process.env.PROD_HOST || "127.0.0.1",
    port: process.env.PROD_PORT || 8081,
    logging: false,
    dialect: "postgres",
  },
};

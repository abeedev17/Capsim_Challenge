const { Sequelize } = require("sequelize");

const config = {
  development: {
    database: "capsim_quiz",
    username: "root",
    password: "",
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    database: "capsim_quiz_test",
    username: "root",
    password: "",
    host: "localhost",
    dialect: "mysql",
  },
};

const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

module.exports = sequelize;

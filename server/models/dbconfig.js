const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("messenger", "postgres", "Monday12", {
  host: "localhost",
  dialect: "postgres",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

module.exports = sequelize

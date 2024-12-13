const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("Single", "Multiple"),
    allowNull: false,
  },
});

const Answer = sequelize.define("Answer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

const Score = sequelize.define("Score", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Question.hasMany(Answer);
Answer.belongsTo(Question);

module.exports = {
  Question,
  Answer,
  Score,
};

const { DataTypes } = require("sequelize");
const sequelize = require("../config/orm");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { tableName: "user" }
);

module.exports = User;

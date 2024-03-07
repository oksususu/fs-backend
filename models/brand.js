const { DataTypes } = require("sequelize");
const sequelize = require("../config/orm");
const User = require("./user");

const Brand = sequelize.define(
  "Brand",
  {
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    brand_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: { type: DataTypes.STRING, allowNull: true },
    brand_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  { tableName: "brand", timestamps: false }
);

module.exports = Brand;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/orm");
const Brand = require("./brand");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_img: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: "brand_id",
      },
    },
  },
  { tableName: "product", timestamps: false }
);

Product.belongsTo(Brand, { foreignKey: "brand_id" });

module.exports = Product;

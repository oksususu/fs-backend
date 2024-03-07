const { DataTypes } = require("sequelize");
const sequelize = require("../config/orm");
const Order = require("./order");
const Product = require("./product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
        key: "order_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: "product_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "order_item", timestamps: false }
);

OrderItem.belongsTo(Product, { foreignKey: "product_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

module.exports = OrderItem;

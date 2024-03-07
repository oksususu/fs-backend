const { ValidationError } = require("../utils/async-handler");
const client = require("../config/dbClient");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const sequelize = require("../config/orm");

/* 주문 조회 */
exports.getOrder = async (req, res) => {
  const { user_id: userId } = req.user;
  let orderDataList = [];

  const order_limit = 5;
  const orders = await Order.findAll({ where: { user_id: userId } });
  for (let order of orders) {
    let { order_id: orderId, total_price: totalPrice, order_date: orderDate, status } = order;
    let orderData = { orderId, totalPrice, orderDate, status };

    const brandId2OrderItems = {};
    // const orderItems = await OrderItem.findAll({ where: { order_id: orderId }, include: [{ model: Product, include: [{ model: Brand }] }] });
    const orderItems = await OrderItem.findAll({ where: { order_id: orderId }, limit: order_limit, include: [{ model: Product }] });
    for (let orderItem of orderItems) {
      let brandId = orderItem.Product.brand_id;
      if (Object.keys(brandId2OrderItems).includes(brandId)) {
        brandId2OrderItems[brandId].push(orderItem);
      } else {
        brandId2OrderItems[brandId] = [orderItem];
      }
    }

    orderData = { ...orderData, brandId2OrderItems };
    orderDataList.push(orderData);
  }

  res.json(orderDataList);
};
/* 주문 생성 */
exports.createOrder = async (req, res) => {
  const { userId, totalPrice, orderItems } = req.body;

  // 참고문서: https://sequelize.org/docs/v6/other-topics/transactions/
  try {
    await sequelize.transaction(async (t) => {
      const order = await Order.create({ user_id: userId, total_price: totalPrice }, { transaction: t });
      const orderId = order.order_id;
      for (let orderItem of orderItems) {
        await OrderItem.create(
          { order_id: orderId, product_id: orderItem.productId, quantity: orderItem.quantity, price: orderItem.price },
          { transaction: t }
        );
      }
    });
  } catch (error) {
    throw new Error("주문 생성 중 에러 발생으로, 주문 생성 cancel" + error);
  }

  res.json("ok");
};

/* 주문 취소 */
exports.cancelOrder = async (req, res) => {
  const { id: orderId } = req.params;

  // sequelize
  try {
    await sequelize.transaction(async (t) => {
      const orderToUpdate = await Order.findByPk(orderId);
      if (!orderToUpdate) {
        throw new ValidationError(404, "존재하지 않는 주문 id입니다");
      }
      orderToUpdate.status = -1;
      await orderToUpdate.save({ transaction: t });
    });
  } catch (error) {
    throw new Error("주문 취소 중 에러 발생으로, 주문 취소 cancel " + error);
  }

  //raw sql
  // const query = `update order set status=-1 where order_id = ${orderId}`;

  // // 유효성 검사 및 데이터 존재 체크
  // const select_query = `select * from order where order_id = ${orderId}`;
  // const product = await client.query(select_query).then((res) => res.rows);
  // if (product.length === 0) {
  //   throw new ValidationError(404, "존재하지 않는 주문 id입니다");
  // }
  // // 업데이트
  // await client.query(query).then((res) => res.rows[0]);

  res.json("ok");
};

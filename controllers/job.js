const { ValidationError } = require("../utils/async-handler");
const tqdm = require("tqdm");
const client = require("../config/dbClient");

const updateProductTotalLike = async (productId, productTotalLike) => {
  query = `update product set total_like=${productTotalLike} where product_id = ${productId}`;
  await client.query(query);
};

/* 모든 상품 totalLike 업데이트 */
exports.updateAllProductTotalLike = async (req, res) => {
  const query = `select * from product_like`;

  // totalLike 조회
  const product2totalLike = new Map();
  const products = await client.query(query).then((res) => res.rows);
  for (let product of products) {
    const { product_id: productId } = product;
    if (product2totalLike.has(productId)) {
      product2totalLike.set(productId, product2totalLike.get(productId) + 1);
    } else {
      product2totalLike.set(productId, 0);
    }
  }

  // totalLike 업데이트
  for (let [productId, productTotalLike] of tqdm(product2totalLike.entries())) {
    await updateProductTotalLike(productId, productTotalLike);
  }

  res.json("ok");
};

const { ValidationError } = require("../utils/async-handler");
const client = require("./dbClient");
const productController = require("../controllers/products");

const updateProductTotalLike = async (productId, type) => {
  // 해당 상품 조회
  let query = `select * from product where product_id = ${productId}`;
  let product = await client.query(query).then((res) => res.rows);
  if (product.length === 0) {
    throw new ValidationError(404, "존재하지 않는 상품 id입니다");
  }

  // 해당 상품 totalLike 수정
  let productTotalLike = product[0].total_like;
  if (type === "minus") {
    productTotalLike--;
  } else if (type === "plus") {
    productTotalLike++;
  }
  query = `update product set total_like=${productTotalLike} where product_id = ${productId}`;
  await client.query(query);

  return productTotalLike;
};

/* 상품 좋아요 등록 */
exports.postProductLike = async (req, res, next) => {
  const { id: productId } = req.params;
  const { userId } = req.body;
  const query = {
    text: `insert into product_like (product_id, user_id) values ($1, $2 ) RETURNING *`,
    values: [productId, userId],
  };
  const selectProductQuery = `SELECT * FROM product_like WHERE product_id = ${productId} and user_id = ${userId}`;

  /* 유효성 체크 */
  // 그냥 등록하지 않아도 되는데 굳이 해당 에리를 띄워주는 이유는 프로세스가 의도하지 않은 방향의 에러나 문제가 있음을 알 수 있기 때문이다.
  const result = await client.query(selectProductQuery);
  if (result.rows.length !== 0) {
    throw new ValidationError(400, "이미 존재합니다.");
  }

  await client.query(query);

  // const totalLike = await updateProductTotalLike(productId, (type = "plus"));

  res.json("ok");
};

/* 상품 좋아요 삭제 */
exports.deleteProductLike = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.body;
  const query = `delete from product_like WHERE product_id = ${productId} and user_id = ${userId}`;
  const selectProductQuery = `SELECT * FROM product_like WHERE product_id = ${productId} and user_id = ${userId}`;

  /* 유효성 체크 */
  // 그냥 내버려두면, 삭제한 꼴인데 굳이 해당 에리를 띄워주는 이유는 프로세스가 의도하지 않은 방향의 에러나 문제가 있음을 알 수 있기 때문이다.
  const result = await client.query(selectProductQuery);
  if (result.rows.length == 0) {
    throw new ValidationError(404, "존재하지 않는 자원입니다.");
  }

  await client.query(query);
  // await updateProductTotalLike(productId, (type = "minus"));

  res.json("ok");
};

/* 브랜드 좋아요 등록 */
exports.postBrandLike = async (req, res) => {
  const { id: brandId } = req.params;
  const { userId } = req.body;
  const query = {
    text: `insert into brand_like (brand_id, user_id) values ($1, $2 ) RETURNING *`,
    values: [brandId, userId],
  };
  const doExistQuery = `SELECT * FROM brand_like WHERE brand_id = ${brandId} and user_id = ${userId}`;
  const isBrandQuery = `SELECT * FROM brand WHERE brand_id = ${brandId}`;

  /* 유효성 체크 */
  const doExist = await client.query(doExistQuery);
  if (doExist.rows.length !== 0) {
    throw new ValidationError(400, "이미 존재합니다.");
  }
  // 좋아요를 등록할때는 해당 브랜드가 존재하는지 체크하지만, 좋아요 제거시에는 해당 브랜드를 체크할 필요가 없음
  const isBrand = await client.query(isBrandQuery);
  if (isBrand.rows.length === 0) {
    throw new ValidationError(400, "존재하지 않는 브랜드입니다.");
  }

  await client.query(query);
  res.json("ok");
};

/* 브랜드 좋아요 삭제 */
exports.deleteBrandLike = async (req, res) => {
  const { id: brandId } = req.params;
  const { userId } = req.body;
  const query = `delete from brand_like WHERE brand_id = ${brandId} and user_id = ${userId}`;
  const selectBrandQuery = `SELECT * FROM brand_like WHERE brand_id = ${brandId} and user_id = ${userId}`;

  /* 유효성 체크 */
  // 그냥 내버려두면, 삭제한 꼴인데 굳이 해당 에리를 띄워주는 이유는 프로세스가 의도하지 않은 방향의 에러나 문제가 있음을 알 수 있기 때문이다.
  const result = await client.query(selectBrandQuery);
  if (result.rows.length == 0) {
    throw new ValidationError(404, "존재하지 않는 자원입니다.");
  }

  await client.query(query);
  res.json("ok");
};

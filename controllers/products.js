const { ValidationError } = require("../utils/async-handler");
const client = require("../config/dbClient");

const user_check_query = "select * from public.user where user_id =";

const product_name_dict = {
  productName: "product_name",
  productImg: "product_img",
  price: "price",
  stockQuantity: "stock_quantity",
  categoryId: "category_id",
  brandId: "brand_id",
  totalLike: "total_like",
  search: "search",
};

const select_product_schema = "product_name, product_img, price, stock_quantity, category_id, brand_id, total_like";

const limit = 10;

/* 좋아요 상품 리스트 조회 */
exports.getProductsByLikeBrand = async (req, res) => {
  const { userId } = req.query;
  // const { userId } = req.body;
  const query = `select * from product join brand on product.brand_id=brand.brand_id where brand.brand_id in (
    select brand_id from brand_like where user_id=${userId})`;

  /* 유효성 체크 */
  const user = await client.query(user_check_query + userId).then((res) => res.rows);
  if (user.length === 0) {
    throw new ValidationError(404, "존재하지 않는 유저 id입니다");
  }
  const products = await client.query(query).then((res) => res.rows);

  res.json(products);
};

exports.getProductsByLikeProduct = async (req, res) => {
  const { userId } = req.query;
  // const { userId } = req.body;
  const query = `select * from product join product_like on product.product_id=product_like.product_id where product_like.user_id = '${userId}'`;

  /* 유효성 체크 */

  const user = await client.query(user_check_query + userId).then((res) => res.rows);
  if (user.length === 0) {
    throw new ValidationError(404, "존재하지 않는 유저 id입니다");
  }
  const products = await client.query(query).then((res) => res.rows);

  res.json(products);
};

/* 특정 상품 조회 */
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const query = `select * from product where product_id = ${id}`;

  const product = await client.query(query).then((res) => res.rows);
  if (product.length === 0) {
    throw new ValidationError(404, "존재하지 않는 상품 id입니다");
  }

  res.json(product[0]);
};

/* 상품 리스트 조회 (with 카테고리 / 브랜드 조회) */
exports.getProducts = async (req, res) => {
  const { categoryId, sort, brandId, keyword } = req.query;

  let query = categoryId ? `select * from product where category_id = '${categoryId}'` : `select * from product`;
  if (brandId) {
    query = categoryId ? `${query} and brand_id = '${brandId}'` : `${query} where brand_id = '${brandId}'`;
  }
  query = sort ? query + `order ${sort} limit ${limit}` : `${query} limit ${limit}`;
  if (keyword) {
    query = `SELECT * FROM product WHERE search @@ websearch_to_tsquery('simple','${keyword.split(" ").join(" or ")}') limit ${limit}`;
  }
  console.log("query=", query);

  if (!keyword && categoryId) {
    const category = await client.query(`select * from category where category_id = '${categoryId}'`).then((res) => res.rows);
    if (category.length === 0) {
      throw new ValidationError(404, "해당 category_id가 존재하지 않습니다.");
    }
  }

  if (!keyword && brandId) {
    const brand = await client.query(`select * from brand where brand_id = '${brandId}'`).then((res) => res.rows);
    if (brand.length === 0) {
      throw new ValidationError(404, "해당 brand_id가 존재하지 않습니다.");
    }
  }

  const products = await client.query(query).then((res) => res.rows);

  res.json(products);
};

/* 상품 등록 */
exports.registerProduct = async (req, res) => {
  const { productName, productImg, price, stockQuantity, categoryId, brandId, totalLike } = req.body;
  const values = {
    productName,
    productImg,
    price,
    stockQuantity,
    categoryId,
    brandId,
    totalLike,
  };

  const query = `insert into product (${Object.keys(values)
    .map((value) => product_name_dict[value])
    .join(", ")}) values ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const query_values = [...Object.values(values)];

  // 유효성 검사 및 데이터 존재 체크

  // 업데이트
  const result = await client.query(query, query_values).then((res) => res.rows[0]);

  res.json(result);
};

/* 상품 업데이트 */
exports.updateProductById = async (req, res) => {
  const { id: productId } = req.params;
  const { productName, productImg, price, stockQuantity, categoryId, brandId, totalLike } = req.body;
  const values = {
    productName,
    productImg,
    price,
    stockQuantity,
    categoryId,
    brandId,
    totalLike,
  };

  const update_value_query = Object.keys(values)
    .map((value) => (typeof values[value] === "string" ? `${product_name_dict[value]} = '${values[value]}'` : `${product_name_dict[value]} = ${values[value]}`))
    .join(", ");
  const query = `update product set ${update_value_query} where product_id = ${productId} RETURNING *`;

  // 유효성 검사 및 데이터 존재 체크
  const select_query = `select * from product where product_id = ${productId}`;
  const product = await client.query(select_query).then((res) => res.rows);
  if (product.length === 0) {
    throw new ValidationError(404, "존재하지 않는 상품 id입니다");
  }

  // 업데이트
  const result = await client.query(query).then((res) => res.rows[0]);

  res.json(result);
};

/* 상품 삭제 */
exports.deleteProductById = async (req, res) => {
  const { id: productId } = req.params;
  const query = `delete from product WHERE product_id = ${productId}`;

  // 데이터 존재 체크
  const select_query = `select * from product where product_id = ${productId}`;
  const product = await client.query(select_query).then((res) => res.rows);
  if (product.length === 0) {
    throw new ValidationError(404, "존재하지 않는 상품 id입니다");
  }

  // 삭제
  await client.query(query);
  res.json("ok");
};

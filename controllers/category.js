const { ValidationError } = require("../utils/async-handler");
const client = require("./dbClient");

const returnBrandsByBrandId = async (brandId) => {
  const select_query = `select * from brand where brand_id = ${brandId}`;
  const brands = await client.query(select_query).then((res) => res.rows);
  if (brands.length === 0) {
    throw new ValidationError(404, "존재하지 않는 브랜드 id입니다");
  }
  return brands;
};

/* 모튼 카테고리 목록 조회 */
exports.getAllCategories = async (req, res) => {
  const query = `select * from category`;

  const categories = await client.query(query).then((res) => res.rows);
  res.json(categories);
};

/* 특정 브랜드 categoryId 목록 조회 */
exports.geCategoriesByBrandId = async (req, res) => {
  const { brandId } = req.params;
  const query = `select DISTINCT category_id from product where brand_id = ${brandId}`;

  // 유효성 체크
  await returnBrandsByBrandId(brandId);

  // 쿼리 실행
  const categories = (await client.query(query).then((res) => res.rows)).map(({ category_id }) => category_id);
  res.json(categories);
};

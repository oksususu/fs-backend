const { ValidationError } = require("../utils/async-handler");
const client = require("../config/dbClient");

brand_name_dict = {
  brandName: "brand_name",
  description: "description",
  brandImg: "brand_img",
  sellerId: "seller_id",
};

const limit = 10;

const checkSameBrandName = async (brandName, updateBrandId = null) => {
  const noBlankBrandName = brandName.split(" ").join("");
  const brandNameCheckQuery = `SELECT brand_name, brand_id from brand where brand_name LIKE '${brandName.charAt(0)}%'`;
  let sameBrands = await client.query(brandNameCheckQuery).then((res) => res.rows);
  sameBrands = sameBrands.filter(({ brand_name: brand, brand_id: brandId }) => brand.split(" ").join("") == noBlankBrandName && brandId != updateBrandId);
  if (sameBrands.length !== 0) {
    throw new ValidationError(400, `같은 브랜드 이름이 존재합니다. 브랜드 이름을 확인해주세요. 유사한 브랜드 이름 목록 : ${JSON.stringify(sameBrands)}`);
  }
};

const returnBrandsByBrandId = async (brandId) => {
  const select_query = `select * from brand where brand_id = ${brandId}`;
  const brands = await client.query(select_query).then((res) => res.rows);
  if (brands.length === 0) {
    throw new ValidationError(404, "존재하지 않는 브랜드 id입니다");
  }

  return brands;
};

const checkUserId = async (userId) => {
  const user = await client.query(`select * from public.user where user_id = ${userId}`).then((res) => res.rows);
  if (user.length === 0) {
    throw new ValidationError(404, "존재하지 않는 유저 id입니다");
  }
};

/* 좋아요 브랜드 리스트 조회 */
exports.geBrandsByLikeBrand = async (req, res) => {
  const { userId } = req.query;
  const query = `select * from brand join brand_like on brand.brand_id=brand_like.brand_id where brand_like.user_id = '${userId}'`;

  // 유저 id 체크
  checkUserId(userId);

  const brands = await client.query(query).then((res) => res.rows);

  res.json(brands);
};

/* 카테고리 브랜드 리스트 조회 */
exports.getBrandsByCategory = async (req, res) => {
  const { categoryId } = req.query;
  const query = `select DISTINCT brand.brand_id from brand join product on product.brand_id=brand.brand_id where product.category_id = '${categoryId}' limit ${limit}`;

  // 카테고리 체크
  const category = client.query(`select * from category where category_id=${categoryId}`);
  if (category.length !== 0) {
    throw new ValidationError(404, `해당 카테고리id가 존재하지 않습니다.`);
  }

  const brand_ids = (await client.query(query).then((res) => res.rows)).map(({ brand_id }) => brand_id);
  const brands = [];
  for (let brand_id of brand_ids) {
    let brand_query = `select * from brand where brand_id=${brand_id}`;
    let brand = await client.query(brand_query).then((res) => res.rows[0]);
    brands.push(brand);
  }
  res.json(brands);
};

/* 특정 브랜드 조회 */
exports.getBrandById = async (req, res) => {
  const { id: brandId } = req.params;

  brands = await returnBrandsByBrandId(brandId);

  res.json(brands[0]);
};

/* 브랜드 리스트 조회 (with sellerId 조회) */
exports.getBrands = async (req, res) => {
  const { sellerId, isRandom } = req.query;
  let query = sellerId ? `select * from brand where seller_id = '${sellerId}'` : `select * from brand`;
  query = JSON.parse(isRandom) ? `${query} ORDER BY RANDOM() limit ${limit}` : `${query} limit ${limit}`;

  // sellerId 체크
  sellerId && (await checkUserId(sellerId));

  const brands = await client.query(query).then((res) => res.rows);
  res.json(brands);
};

/* 브랜드 등록 */
exports.registerBrand = async (req, res) => {
  const { brandName, description, brandImg, sellerId } = req.body;
  const values = {
    brandName,
    description,
    brandImg,
    sellerId,
  };

  const query = `insert into brand (${Object.keys(values)
    .map((value) => brand_name_dict[value])
    .join(", ")}) values ($1,$2,$3,$4) RETURNING *`;
  const query_values = [...Object.values(values)];

  // 유효성 검사 및 데이터 존재 체크
  if (!brandName) {
    throw new ValidationError(404, "브랜드 이름을 넣어주세요");
  }

  // 같은 브랜드 이름 체크 && seller 체크
  (await checkSameBrandName(brandName)) & (await checkUserId(sellerId));

  // 업데이트
  const result = await client.query(query, query_values).then((res) => res.rows[0]);

  res.json(result);
};

/* 브랜드 업데이트 */
exports.updateBrandById = async (req, res) => {
  const { id: brandId } = req.params;
  const { brandName, description, brandImg, sellerId } = req.body;
  const values = {
    brandName,
    description,
    brandImg,
    sellerId,
  };

  const update_value_query = Object.keys(values)
    .map((value) => (typeof values[value] === "string" ? `${brand_name_dict[value]} = '${values[value]}'` : `${brand_name_dict[value]} = ${values[value]}`))
    .join(", ");
  const query = `update brand set ${update_value_query} where brand_id = ${brandId} RETURNING *`;

  // 유효성 검사 및 데이터 존재 체크
  // 브랜드 id 체크 및 같은 브랜드 이름 체크
  (await returnBrandsByBrandId(brandId)) && (await checkSameBrandName(brandName, brandId));
  // seller id 체크
  await checkUserId(sellerId);

  // 업데이트
  const result = await client.query(query).then((res) => res.rows[0]);
  res.json(result);
};

/* 브랜드 삭제 */
exports.deleteBrandById = async (req, res) => {
  const { id: brandId } = req.params;
  const query = `delete from brand WHERE brand_id = ${brandId}`;

  // 데이터 존재 체크
  await returnBrandsByBrandId(brandId);

  // 삭제
  await client.query(query);
  res.json("ok");
};

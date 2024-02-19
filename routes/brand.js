var express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const brandController = require("../controllers/brand");

var router = express.Router();

/* 좋아요 브랜드 리스트 조회 */
router.get("/like/", asyncHandler(brandController.geBrandsByLikeBrand));

/* 브랜드 조회 api */
router.get("/", asyncHandler(brandController.getBrands));

/* 해당 브랜드 조회 api */
router.get("/:id", asyncHandler(brandController.getBrandById));

/* 브랜드 등록 api */
router.post("/", asyncHandler(brandController.registerBrand));

/* 브랜드 업데이트 api */
router.put("/:id", asyncHandler(brandController.updateBrandById));

/* 브랜드 삭제 api */
router.delete("/:id", asyncHandler(brandController.deleteBrandById));

module.exports = router;

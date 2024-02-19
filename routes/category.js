var express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const categoryController = require("../controllers/category");

var router = express.Router();

/* 모튼 카테고리 목록 조회 */
router.get("/", asyncHandler(categoryController.getAllCategories));

/* 특정 브랜드 categoryId 목록 조회 */
router.get("/:brandId", asyncHandler(categoryController.geCategoriesByBrandId));

module.exports = router;

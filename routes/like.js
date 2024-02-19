const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const likeController = require("../controllers/like");
const productController = require("../controllers/products");

const router = express.Router();

/* 상품 좋아요 등록 */
router.post("/product/:id", asyncHandler(likeController.postProductLike));

/* 상품 좋아요 삭제 */
router.delete("/product/:id", asyncHandler(likeController.deleteProductLike));

/* 브랜드 좋아요 등록 */
router.post("/brand/:id", asyncHandler(likeController.postBrandLike));

/* 브랜드 좋아요 삭제 */
router.delete("/brand/:id", asyncHandler(likeController.deleteBrandLike));

module.exports = router;

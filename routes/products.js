var express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const productController = require("../controllers/products");

var router = express.Router();

/* 좋아요 상품 조회 api*/
router.get("/like_brand/", productController.getProductsByLikeBrand);
router.get("/like_product/", productController.getProductsByLikeProduct);

/* 상품 조회 api*/
router.get("/", asyncHandler(productController.getProducts));

/* 해당 상품 조회 api*/
router.get("/:id", asyncHandler(productController.getProductById));

/* 상품 등록 api*/
router.post("/", asyncHandler(productController.registerProduct));

/* 상품 업데이트 api*/
router.put("/:id", asyncHandler(productController.updateProductById));

/* 상품 삭제 api*/
router.delete("/:id", asyncHandler(productController.deleteProductById));

module.exports = router;

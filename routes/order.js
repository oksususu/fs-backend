var express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const orderController = require("../controllers/order");
const passport = require("passport");

var router = express.Router();

/* 주문 조회 api*/
router.get("/", passport.authenticate("jwt-user", { session: false }), asyncHandler(orderController.getOrder));

/* 주문 생성 api*/
router.post("/", passport.authenticate("jwt-user", { session: false }), asyncHandler(orderController.createOrder));

/* 주문 취소 api*/
router.put("/:id", passport.authenticate("jwt-user", { session: false }), asyncHandler(orderController.cancelOrder));

module.exports = router;

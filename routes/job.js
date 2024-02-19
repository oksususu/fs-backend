var express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const jobController = require("../controllers/job");

var router = express.Router();

/* 상품 totalLike 업데이트 Job */
router.get("/update_total_like/", asyncHandler(jobController.updateAllProductTotalLike));

module.exports = router;

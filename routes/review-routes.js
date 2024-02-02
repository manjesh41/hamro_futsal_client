const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/review-controller");

router.get("/", reviewsController.getAllReviews);
router.post("/createReview", reviewsController.createReview);
router.get("/:id", reviewsController.getReviewById);

router.put("/:id", reviewsController.updateReviewById);
router.delete("/:id", reviewsController.deleteReviewById);

module.exports = router;

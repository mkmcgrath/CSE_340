// Needed Resources
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

// Route to add a review (POST) - requires login
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// Route to build edit review view (GET) - requires login and ownership
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

// Route to process review update (POST) - requires login and ownership
router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewUpdateRules(),
  reviewValidate.checkReviewUpdateData,
  utilities.handleErrors(reviewController.updateReview)
)

// Route to build delete review confirmation (GET) - requires login and ownership
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReview)
)

// Route to process review deletion (POST) - requires login and ownership
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router

const utilities = require(".")
const { body, validationResult } = require("express-validator")
const reviewModel = require("../models/review-model")
const validate = {}

/* **********************************
 *  Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid inventory item."),
    body("review_rating")
      .trim()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),
    body("review_text")
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),
  ]
}

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id, review_rating, review_text } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors in your review.")
    res.redirect(`/inv/detail/${inv_id}`)
    return
  }
  next()
}

/* **********************************
 *  Review Update Validation Rules
 * ********************************* */
validate.reviewUpdateRules = () => {
  return [
    body("review_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid review ID."),
    body("review_rating")
      .trim()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5 stars."),
    body("review_text")
      .trim()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),
  ]
}

/* ******************************
 * Check review update data and return errors or continue
 * ***************************** */
validate.checkReviewUpdateData = async (req, res, next) => {
  const { review_id, review_rating, review_text } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("review/edit-review", {
      errors,
      title: "Edit Review",
      nav,
      review_id,
      review_rating,
      review_text,
    })
    return
  }
  next()
}

module.exports = validate

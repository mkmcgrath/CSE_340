const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { inv_id, review_rating, review_text } = req.body
  const account_id = res.locals.accountData.account_id

  const result = await reviewModel.addReview(parseInt(inv_id), account_id, parseInt(review_rating), review_text)

  if (result && result.rowCount > 0) {
    req.flash("notice", "Your review was successfully added.")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)

    if (!reviewData) {
      req.flash("notice", "Review not found.")
      return res.redirect("/account/")
    }

    // Check if the user owns this review
    if (reviewData.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "You can only edit your own reviews.")
      return res.redirect("/account/")
    }

    res.render("review/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      review_id: reviewData.review_id,
      inv_id: reviewData.inv_id,
      review_rating: reviewData.review_rating,
      review_text: reviewData.review_text,
    })
  } catch (error) {
    return next(error)
  }
}

/* ***************************
 *  Update Review
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  const { review_id, review_rating, review_text } = req.body

  const updateResult = await reviewModel.updateReview(review_id, review_rating, review_text)

  if (updateResult && updateResult.review_id) {
    req.flash("notice", "Your review was successfully updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect(`/review/edit/${review_id}`)
  }
}

/* ***************************
 *  Build delete review view
 * ************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id)
    let nav = await utilities.getNav()
    const reviewData = await reviewModel.getReviewById(review_id)

    if (!reviewData) {
      req.flash("notice", "Review not found.")
      return res.redirect("/account/")
    }

    // Check if the user owns this review
    if (reviewData.account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "You can only delete your own reviews.")
      return res.redirect("/account/")
    }

    res.render("review/delete-review", {
      title: "Delete Review",
      nav,
      errors: null,
      review_id: reviewData.review_id,
      inv_id: reviewData.inv_id,
      review_rating: reviewData.review_rating,
      review_text: reviewData.review_text,
    })
  } catch (error) {
    return next(error)
  }
}

/* ***************************
 *  Delete Review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const review_id = parseInt(req.body.review_id)
  const deleteResult = await reviewModel.deleteReview(review_id)

  if (deleteResult && deleteResult.rowCount && deleteResult.rowCount > 0) {
    req.flash("notice", "The review was successfully deleted.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/review/delete/${review_id}`)
  }
}

module.exports = reviewCont

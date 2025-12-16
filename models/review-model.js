const pool = require("../database/")

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `INSERT INTO public.review (inv_id, account_id, review_rating, review_text)
                 VALUES ($1, $2, $3, $4) RETURNING *`
    return await pool.query(sql, [inv_id, account_id, review_rating, review_text])
  } catch (error) {
    console.error("addReview error " + error)
    return error.message
  }
}

/* ***************************
 *  Get all reviews for a specific inventory item
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname
       FROM public.review AS r
       JOIN public.account AS a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByInventoryId error " + error)
    return []
  }
}

/* ***************************
 *  Get all reviews by a specific account
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, i.inv_make, i.inv_model, i.inv_year
       FROM public.review AS r
       JOIN public.inventory AS i ON r.inv_id = i.inv_id
       WHERE r.account_id = $1
       ORDER BY r.review_date DESC`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
    return []
  }
}

/* ***************************
 *  Get a single review by review_id
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review WHERE review_id = $1`,
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error " + error)
  }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_id, review_rating, review_text) {
  try {
    const sql = `UPDATE public.review
                 SET review_rating = $1, review_text = $2, review_date = CURRENT_TIMESTAMP
                 WHERE review_id = $3 RETURNING *`
    const data = await pool.query(sql, [review_rating, review_text, review_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateReview error: " + error)
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM public.review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("deleteReview error: " + error)
  }
}

/* ***************************
 *  Get average rating for an inventory item
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const data = await pool.query(
      `SELECT AVG(review_rating) as avg_rating, COUNT(*) as review_count
       FROM public.review
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getAverageRating error " + error)
    return { avg_rating: 0, review_count: 0 }
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  updateReview,
  deleteReview,
  getAverageRating,
}

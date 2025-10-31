const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
 *  Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name is required and may not contain spaces or special characters."),
  ]
}

/* ******************************
 * Check classification and return errors or continue
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id").trim().notEmpty().withMessage("Please choose a classification."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").trim().isLength({ min: 4, max: 4 }).withMessage("Please provide a 4-digit year."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").trim().notEmpty().isFloat().withMessage("Price is required and must be a number."),
    body("inv_miles").trim().notEmpty().isInt().withMessage("Miles is required and must be an integer."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    // images and thumbnail are optional but sanitize
    body("inv_image").trim().escape().optional({ checkFalsy: true }),
    body("inv_thumbnail").trim().escape().optional({ checkFalsy: true }),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_image, inv_thumbnail } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // rebuild classification list with selected value
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_image,
      inv_thumbnail,
    })
    return
  }
  next()
}

module.exports = validate

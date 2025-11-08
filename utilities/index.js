const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
 * Build a single vehicle detail HTML
 * Expects a vehicle object with fields like
 * inv_make, inv_model, inv_year, inv_price,
 * inv_miles, inv_image, inv_description, etc.
 ************************************** */
Util.buildVehicleDetail = async function(vehicle) {
  if(!vehicle) return ''
  // Build a richer layout: left = images (main + thumbs), right = info + actions
  let detail = '<div id="vehicle-detail">'

  // Left column: images
  detail += '<div class="vehicle-image">'
  detail += '<div class="main-image">'
  detail += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />'
  detail += '</div>'
  // thumbnails (if thumbnail available) -- include the main thumbnail as one
  detail += '<div class="thumbs">'
  if (vehicle.inv_thumbnail) {
    detail += '<a href="' + vehicle.inv_image + '" class="thumb"><img src="' + vehicle.inv_thumbnail + '" alt="thumbnail"/></a>'
  }
  // include main image as fallback thumbnail
  detail += '<a href="' + vehicle.inv_image + '" class="thumb"><img src="' + vehicle.inv_image + '" alt="image"/></a>'
  detail += '</div>'
  detail += '</div>'

  // Right column: info and actions
  detail += '<div class="vehicle-info">'
  detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' <span class="year">(' + vehicle.inv_year + ')</span></h2>'
  detail += '<p class="price">' + new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(vehicle.inv_price) + '</p>'
  detail += '<p class="miles">Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
  if(vehicle.inv_color) detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
  if(vehicle.inv_description) detail += '<p class="desc">' + vehicle.inv_description + '</p>'

  // Action buttons similar to the example
  detail += '<div class="action-buttons">'
  detail += '<a class="btn primary" href="#">Start My Purchase</a>'
  detail += '<a class="btn outline" href="#">Contact Us</a>'
  detail += '<a class="btn outline" href="#">Schedule Test Drive</a>'
  detail += '<a class="btn outline" href="#">Apply for Financing</a>'
  detail += '</div>'

  // Dealer contact / callout
  detail += '<div class="dealer-contact">'
  detail += '<p><strong>Call Us</strong></p>'
  detail += '<p class="phone">801-396-7886</p>'
  detail += '</div>'

  detail += '</div>'

  detail += '</div>'
  return detail
}

/* **************************************
 * Build a classification select list
 * Returns a <select> element string with options
 * classification_id as the value and classification_name as the display
 ************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += ' selected '
    }
    classificationList += '>' + row.classification_name + '</option>'
  })
  classificationList += '</select>'
  return classificationList
}

module.exports = Util
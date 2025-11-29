// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view
router.get(
	"/type/:classificationId",
	utilities.handleErrors(invController.buildByClassificationId)
)

// Return inventory for a classification as JSON (AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build a single inventory detail view
router.get(
	"/detail/:invId",
	utilities.handleErrors(invController.buildByInventoryId)
)

// Management view (mounted at /inv/) - requires Employee or Admin
router.get(
	"/",
	utilities.checkAccountType,
	utilities.handleErrors(invController.buildManagement)
)

// Build edit inventory view - requires Employee or Admin
router.get(
	"/edit/:inv_id",
	utilities.checkAccountType,
	utilities.handleErrors(invController.editInventoryView)
)

// Process the update - requires Employee or Admin
router.post(
	"/update",
	utilities.checkAccountType,
	invValidate.inventoryRules(),
	invValidate.checkUpdateData,
	utilities.handleErrors(invController.updateInventory)
)

// Build delete confirmation view - requires Employee or Admin
router.get(
	"/delete/:inv_id",
	utilities.checkAccountType,
	utilities.handleErrors(invController.buildDeleteView)
)

// Process delete - requires Employee or Admin
router.post(
	"/delete",
	utilities.checkAccountType,
	utilities.handleErrors(invController.deleteInventory)
)

// Add classification (GET) - requires Employee or Admin
router.get(
	"/add-classification",
	utilities.checkAccountType,
	utilities.handleErrors(invController.buildAddClassification)
)

// Add classification (POST) - requires Employee or Admin
router.post(
	"/add-classification",
	utilities.checkAccountType,
	invValidate.classificationRules(),
	invValidate.checkClassData,
	utilities.handleErrors(invController.addClassification)
)

// Add inventory (GET) - requires Employee or Admin
router.get(
	"/add-inventory",
	utilities.checkAccountType,
	utilities.handleErrors(invController.buildAddInventory)
)

// Add inventory (POST) - requires Employee or Admin
router.post(
	"/add-inventory",
	utilities.checkAccountType,
	invValidate.inventoryRules(),
	invValidate.checkInventoryData,
	utilities.handleErrors(invController.addInventory)
)

module.exports = router;
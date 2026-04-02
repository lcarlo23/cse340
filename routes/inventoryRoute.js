// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
);

// Route to build inventory item by detail view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId),
);

// Route to build vehicle management view
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement),
);

// Route to build add classification form
router.get(
  "/classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildClassification),
);

router.post(
  "/classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

// Route to build inventory form
router.get(
  "/inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildInventory),
);

router.post(
  "/inventory",
  utilities.checkAccountType,
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  utilities.handleErrors(invController.addVehicle),
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON),
);

// Route to edit inventory form
router.get(
  "/edit/:inventory_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventory),
);

// Route to edit inventory form
router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.vehicleRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

// Route to edit inventory form
router.get(
  "/delete/:inventory_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteView),
);

// Route to edit inventory form
router.post(
  "/delete/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem),
);

module.exports = router;

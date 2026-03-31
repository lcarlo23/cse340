const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name;
  res.render("inventory/classification", {
    title: className ? className + " vehicles" : "No vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getDetailByInventoryId(inv_id);
  const vehicle = data[0];
  const wrapper = await utilities.buildDetailWrapper(vehicle);
  let nav = await utilities.getNav();
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  res.render("inventory/detail", {
    title: vehicleName,
    nav,
    wrapper,
  });
};

/* ****************************************
 *  Deliver management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
  });
};

/* ****************************************
 *  Deliver classification view
 * *************************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process New Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  const classificationResult =
    await invModel.addClassification(classification_name);

  let nav = await utilities.getNav();

  if (classificationResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`,
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the registration of the classification name failed.",
    );
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Deliver inventory view
 * *************************************** */
invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classification,
    errors: null,
  });
};

/* ****************************************
 *  Process New Vehicle
 * *************************************** */
invCont.addVehicle = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const vehicleResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  );

  let nav = await utilities.getNav();

  if (vehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} vehicle was successfully added.`,
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the addition of the vehicle has failed.");
    let classification = await utilities.buildClassificationList();
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classification,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 *  Deliver inventory view
 * *************************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getDetailByInventoryId(inv_id);
  let classificationSelect = await utilities.buildClassificationList(
    itemData[0].classification_id,
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("inventory/edit-inventory", {
    title: `Edit ${itemName}`,
    nav,
    classification: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
  });
};

/* ****************************************
 *  Update Vehicle
 * *************************************** */
invCont.updateInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;

  const vehicleResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  );

  let nav = await utilities.getNav();

  if (vehicleResult) {
    const itemName = vehicleResult.inv_make + " " + vehicleResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
      }
      res.redirect("/inv/");
    });
  } else {
    const classificationSelect =
      await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classification: classificationSelect,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    });
  }
};

module.exports = invCont;

const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/*  **********************************
 *  New Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct classification name.")
      .custom(async (classification_name) => {
        const classificationExists =
          await invModel.checkExistingClassification(classification_name);
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please choose a different classification name.",
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  New Classification Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Select a valid classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a correct make name.")
      .isLength({ min: 3 })
      .withMessage("The make name must be at least 3 characters long."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a correct model name.")
      .isLength({ min: 3 })
      .withMessage("The model name must be at least 3 characters long."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a correct description."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Provide a correct image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Provide a correct thumbnail path."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("The price field cannot be empty.")
      .isFloat({ min: 0.0 })
      .withMessage("Provide a valid price."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("The year field cannot be empty.")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Provide a valid 4-digit year.")
      .toInt(),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("The miles field cannot be empty.")
      .isInt({ min: 0, max: 800000 })
      .withMessage("Provide a valid miles value (digits only).")
      .toInt(),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("The vehicle's color is required."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classification =
      await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
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
    });
    return;
  }
  next();
};

module.exports = validate;

// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accValidate = require("../utilities/account-validation");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister),
);

// Route post account
router.post(
  "/register",
  accValidate.registrationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

// Process the login attempt
router.post(
  "/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

// Route to build account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount),
);

// Route to edit account information
router.get(
  "/edit/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccountView),
);

// Route to update account information on db
router.post(
  "/edit/",
  // utilities.checkLogin,
  accValidate.updateRules(),
  accValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo),
);

// Route to update account password on db
router.post(
  "/editpw/",
  utilities.checkLogin,
  accValidate.changePasswordRules(),
  accValidate.checkPassword,
  utilities.handleErrors(accountController.changePassword),
);

// Process the logout attempt
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;

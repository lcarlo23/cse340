const utilities = require("../utilities/");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  let form = await utilities.buildLoginForm();
  res.render("account/login", {
    title: "Login",
    nav,
    form,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  let form = await utilities.buildRegisterForm();
  res.render("account/register", {
    title: "Register",
    nav,
    form,
    errors: null,
  });
}

module.exports = { buildLogin, buildRegister };

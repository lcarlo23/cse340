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

module.exports = { buildLogin };

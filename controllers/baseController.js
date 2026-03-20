const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

baseController.throwError = async function (req, res, next) {
  throw new Error("Intentional Error 500 for week3 assignment");
};

module.exports = baseController;

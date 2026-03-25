const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailWrapper = async function (data) {
  let wrapper;
  wrapper = `<div class="detail-wrapper">
    <img src="${data.inv_image}"
      alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
      <div class="vehicle-details">
        <h2>${data.inv_make} ${data.inv_model} Details</h2>
        <p class="price">Price: $${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
        <p class="description"><b>Details:</b> ${data.inv_description}</p>
        <p class="color"><b>Color:</b> ${data.inv_color}</p>
        <p class="color"><b>Miles:</b> ${data.inv_miles.toLocaleString("en-US")}</p>
      </div>
    </div>`;
  return wrapper;
};

/* **************************************
 * Build the login view HTML
 * ************************************ */
Util.buildLoginForm = async function () {
  let form;
  form = `<form class="login-form">
  <label for="email">Email:</label>
  <input type="email" name="account_email" id="email"/>
  <label for="password">Password:</label>
  <input type="password" name="account_password" id="password"/>
  <button>LOGIN</button>
  <p>No account? <a href="">Sign-up</a></p>
  </form>`;
  return form;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;

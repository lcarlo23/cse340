const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again.",
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account view
 * *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account", {
    title: "Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver update account view
 * *************************************** */
async function buildEditAccountView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process update account
 * *************************************** */
async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updatedResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  );

  if (updatedResult) {
    const newToken = jwt.sign(updatedResult, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", newToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    req.flash("notice", `Congratulations, your information has been updated.`);
    return res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process change password
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const changeResult = await accountModel.changePassword(
    hashedPassword,
    account_id,
  );

  if (changeResult) {
    req.flash("notice", `Congratulations, your password has been changed.`);
    res.status(201).render("account", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the password change failed.");
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      account_id,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  let nav = await utilities.getNav();
  try {
    res.clearCookie("jwt");

    if (req.session) {
      delete res.locals.accountData;
      delete res.locals.loggedin;
    }

    req.flash("notice", "Logout successful.");
    return res.redirect("/");
  } catch (error) {
    throw new Error("Logout failed.");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccount,
  accountLogin,
  buildEditAccountView,
  updateAccountInfo,
  changePassword,
  accountLogout,
};

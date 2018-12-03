const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddRoleInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.permissioncode = !isEmpty(data.permissioncode)
    ? data.permissioncode
    : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Email field is required";
  }

  if (!validator.isNumeric(data.permissioncode.toString())) {
    errors.permissioncode = "Permission code field should be numeric";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBranchInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Branch name field is required";
  }

  data.city = !isEmpty(data.city) ? data.city : "";

  if (validator.isEmpty(data.city)) {
    errors.city = "City field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

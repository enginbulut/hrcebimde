const validator = require("validator");
const isEmpty = require("./is-empty");
function isValidDate(value) {
  if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

  const date = new Date(value);
  if (!date.getTime()) return false;
  return date.toISOString().slice(0, 10) === value;
}

module.exports = function validateAnnouncementInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Announcement name field is required";
  }

  data.description = !isEmpty(data.description) ? data.description : "";

  if (validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  data.startDate = !isEmpty(data.startDate) ? data.startDate : "";
  data.endDate = !isEmpty(data.endDate) ? data.endDate : "";
  if (!validator.isEmpty(data.startDate)) {
    if (!isValidDate(data.startDate))
      errors.startDate = "StartDate field is not valid";
  }
  if (!validator.isEmpty(data.endDate)) {
    if (!isValidDate(data.endDate))
      errors.endDate = "EndDate field is not valid";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

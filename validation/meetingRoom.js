const validator = require("validator");
const isEmpty = require("./is-empty");

const validateCreate = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = {
    validateCreate
}

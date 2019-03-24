const validator = require("validator");
const isEmpty = require("./is-empty");

const validateCreate = (data) => {
    let errors = {};

    data.meetingRoomId = !isEmpty(data.meetingRoomId) ? data.meetingRoomId : "";
    if (validator.isEmpty(data.meetingRoomId)) {
        errors.meetingRoomId = "meeting room info is required";
    }
    data.userId = !isEmpty(data.userId) ? data.userId : "";
    if (validator.isEmpty(data.userId)) {
        errors.userId = "user info is required";
    }
    data.startDate = !isEmpty(data.startDate) ? data.startDate : "";
    if (validator.isEmpty(data.startDate)) {
        errors.startDate = "start date is required";
    }
    data.endDate = !isEmpty(data.endDate) ? data.endDate : "";
    if (validator.isEmpty(data.endDate)) {
        errors.endDate = "end date is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = {
    validateCreate
}

const utils = require("./utils");
const common = require("./common");
const moment = require('moment');
//Load input validation
const validator = require("../validation/meetingRoomBook");
const meetingRoomBookModel = require('../models/MeetingRoomBook');

const saveMeetingRoom = async payload => {
  const { errors, isValid } = validator.validateCreate(payload);
  if (!isValid)
    throw common.helper.wrapError(errors, 400);

  const startDate = moment.utc(payload.startDate);
  const endDate = moment.utc(payload.endDate);

  var result = await meetingRoomBookModel.saveMeetingRoomBook(
    payload.meetingRoomId,
    payload.userId,
    startDate.toDate(),
    endDate.toDate(),
    payload.desc
  );
  return result;
};

module.exports = {
  saveMeetingRoom
};

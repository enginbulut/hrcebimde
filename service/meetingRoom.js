const utils = require("../service/utils");
const common = require("../service/common");
//Load input validation
const validator = require("../validation/meetingRoom");

const meetingRoomModel = require("../models/MeetingRoom");

const upsertMeetingRoom = async payload => {
  const { errors, isValid } = validator.validateCreate(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  var result = await meetingRoomModel.save(payload);

  return result;
};

const getAllMeetingRooms = async () => {
  return await meetingRoomModel.getAllRooms();
};

const getActiveMeetingRooms = async () => {
  return await meetingRoomModel.getActiveRooms();
};

const deleteMeetingRoom = async name => {
  const meetingRoom = await meetingRoomModel.getMeetingRoomByName(name);
  if (!meetingRoom) {
    let errors = {};
    errors.name = "Department can not found";
    throw common.helper.wrapError(errors, 404);
  }
  //TODO: check if room has any planned meetings. if has do not delete meeting room.
  const hasMeeting = false;
  let status = true;
  if (!hasMeeting)
    status = await meetingRoomModel.deleteMeetingRoom(name);

  return status;
};

module.exports = {
  upsertMeetingRoom,
  deleteMeetingRoom,
  getAllMeetingRooms,
  getActiveMeetingRooms
};

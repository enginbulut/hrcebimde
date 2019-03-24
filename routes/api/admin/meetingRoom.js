const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const meetingRoomService = require("../../../service/meetingRoom");
const meetingRoomBookService = require('../../../service/meetingRoomBook');

common.api.private.get(router, "/list", utils.RoleType.Employee, async function (
  req
) {
  const departments = await meetingRoomService.getActiveMeetingRooms();
  return departments;
});

common.api.private.post(router, "/save", utils.RoleType.HR, async function (
  req
) {
  const newMeetingRoom = await meetingRoomService.upsertMeetingRoom(req.body);
  return newMeetingRoom;
});

common.api.private.delete(
  router,
  "/delete",
  utils.RoleType.HR,
  async function (req) {
    return await meetingRoomService.deleteMeetingRoom(req.body.name.toLocaleLowerCase());
  }
);

common.api.private.post(router, "/book", utils.RoleType.Employee, async function (
  req
) {
  const book = await meetingRoomBookService.saveMeetingRoom(req.body);
  return book;
});



module.exports = router;

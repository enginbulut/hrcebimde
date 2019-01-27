const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const announcementService = require("../../../service/announcement");

common.api.private.get(router, "/list", utils.RoleType.Employee, async function(
  req
) {
  const announcements = await announcementService.getActiveAnnouncements();
  return announcements;
});

common.api.private.post(router, "/add", utils.RoleType.Manager, async function(
  req
) {
  const newAnnouncement = await announcementService.addAnnouncement(req.body);
  return newAnnouncement;
});

common.api.private.delete(
  router,
  "/delete/:announcementid",
  utils.RoleType.Manager,
  async function(req) {
    await announcementService.deleteAnnouncment(req.params.announcementid);
    return req.params.announcementid;
  }
);

module.exports = router;

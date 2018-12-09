const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const titleService = require("../../../service/title");

common.api.private.get(router, "/list", utils.RoleType.Manager, async function(
  req
) {
  const titles = await titleService.getTitles();
  return titles;
});

common.api.private.post(router, "/add", utils.RoleType.Admin, async function(
  req
) {
  const newTitle = await titleService.addTitle(req.body);
  return newTitle;
});

common.api.private.delete(
  router,
  "/delete/:titleid",
  utils.RoleType.Admin,
  async function(req) {
    await titleService.deleteTitle(req.params.titleid);
    return req.params.titleid;
  }
);

module.exports = router;

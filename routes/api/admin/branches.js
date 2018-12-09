const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const branchService = require("../../../service/branch");

common.api.private.get(router, "/list", utils.RoleType.Employee, async function(
  req
) {
  const branches = await branchService.getBranches();
  return branches;
});

common.api.private.post(router, "/add", utils.RoleType.Admin, async function(
  req
) {
  const newBranch = await branchService.addBranch(req.body);
  return newBranch;
});

common.api.private.delete(
  router,
  "/delete/:branchid",
  utils.RoleType.Admin,
  async function(req) {
    await branchService.deleteBranch(req.params.branchid);
    return req.params.branchid;
  }
);

module.exports = router;

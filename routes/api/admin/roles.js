const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const roleService = require("../../../service/role");

common.api.public.get(router, "/list", async function(req) {
  const roles = await roleService.getRoles();
  return roles;
});

common.api.private.post(
  router,
  "/add",
  utils.RoleType.SuperAdmin,
  async function(req) {
    const newRole = await roleService.addRole(req.body);
    return newRole;
  }
);

common.api.private.delete(
  router,
  "/delete/:roleid",
  utils.RoleType.SuperAdmin,
  async function(req) {
    await roleService.deleteRole(req.params.roleid);
    return req.params.roleid;
  }
);

module.exports = router;

const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const userService = require("../../../service/user");

common.api.public.post(router, "/register", async function(req) {
  const newUser = await userService.registerUser(req.body);
  return newUser;
});

common.api.public.post(router, "/login", async function(req) {
  const token = await userService.loginUser(req.body);
  return "Bearer " + token;
});

common.api.private.get(router, "/current", utils.RoleType.Guest, req => {
  return {
    name: req.user.name,
    email: req.user.email,
    id: req.user.id,
    permissioncode: req.user.role.permissioncode,
    rolename: req.user.role.name
  };
});

common.api.private.post(
  router,
  "/changePassword",
  utils.RoleType.Guest,
  async function(req) {
    const updatedUser = await userService.changePassword(req.user.id, req.body);
    return updatedUser;
  }
);

common.api.private.post(
  router,
  "/updateRole",
  utils.RoleType.Guest,
  async function(req) {
    const updatedUser = await userService.updateRole(req.user.id, req.body);
    return updatedUser;
  }
);

module.exports = router;

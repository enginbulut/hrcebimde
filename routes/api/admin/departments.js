const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

//Load Services
const departmentService = require("../../../service/department");

common.api.private.get(router, "/list", utils.RoleType.Employee, async function(
  req
) {
  const departments = await departmentService.getDepartments();
  return departments;
});

common.api.private.post(router, "/add", utils.RoleType.Admin, async function(
  req
) {
  const newDepartment = await departmentService.addDepartment(req.body);
  return newDepartment;
});

common.api.private.delete(
  router,
  "/delete/:departmentid",
  utils.RoleType.Admin,
  async function(req) {
    await departmentService.deleteDepartment(req.params.departmentid);
    return req.params.departmentid;
  }
);

module.exports = router;

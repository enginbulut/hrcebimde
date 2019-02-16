const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

const employeeService = require('../../../service/employee');

common.api.private.get(router, "/get", utils.RoleType.Manager, async function (req) {
    const employee = await employeeService.getAll();
    return employee;
});

common.api.private.get(router, "/get/:userId", utils.RoleType.Manager, async function (req) {
    const employee = await employeeService.getEmployee(req.params.userId);
    return employee;
});

common.api.private.post(router, '/save', utils.RoleType.Manager, async function (req) {
    const employee = await employeeService.upsertEmployee(req.body);
    return employee;
});

common.api.private.delete(router, '/delete/:userId', utils.RoleType.Manager, async function (req) {
    const employee = await employeeService.deleteEmployee(req.params.userId);
    return employee;
});


module.exports = router;

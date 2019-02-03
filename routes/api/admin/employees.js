const router = new (require("restify-router")).Router();
const common = require("../../../service/common");
const utils = require("../../../service/utils");

const employeeService = require('../../../service/employee');

common.api.public.get(router, "/get", async function (req) {
    const employee = await employeeService.getAll();
    return employee;
});

common.api.public.get(router, "/get/:employeeId", async function (req) {
    const employee = await employeeService.getEmployee(req.params.employeeId);
    return employee;
});

common.api.public.post(router, '/save',  async function (req) {
    const employee = await employeeService.upsertEmployee(req.body);
    return employee;
});

module.exports = router;

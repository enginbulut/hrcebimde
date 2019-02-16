const common = require("../service/common");
//Load User model and user domain
const EmployeeModel = require("../models/EmployeeModel");
const Employee = require("../domain/employee");

const upsertEmployee = async payload => {
    const { errors, isValid } = EmployeeModel.validate.schema(payload);
    if (!isValid) {
        throw common.helper.wrapError(errors, 400);
    }

    const employee = await EmployeeModel.save(payload);
    return employee;
};


const getEmployee = async userId => {
    const employee = await EmployeeModel.findById(userId);
    return employee;
};

const getAll = async () => {
    const employees = await EmployeeModel.getAll();
    return employees;
};

const deleteEmployee = async userId => {
    await EmployeeModel.deletebyId(userId);
}


module.exports = {
    getEmployee,
    upsertEmployee,
    getAll,
    deleteEmployee,
    setEmployeeUser
}
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


const getEmployee = async id => {
    const employee = await EmployeeModel.findById(id);
    return employee;
};

const getAll = async () => {
    const employees = await EmployeeModel.getAll();
    return employees;
};

const deleteEmployee = async id => {
    await EmployeeModel.deletebyId(id);
}

const setEmployeeUser = async (id, userId) => {
    const { errors, isValid } = EmployeeModel.validate.setUser(id, userId);
    if (!isValid) {
        throw common.helper.wrapError(errors, 400);
    }

    const employee = await EmployeeModel.setUser(id, userId);
    return employee;
};

module.exports = {
    getEmployee,
    upsertEmployee,
    getAll,
    deleteEmployee,
    setEmployeeUser
}
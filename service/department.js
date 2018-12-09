const utils = require("../service/utils");
const common = require("../service/common");
//Load input validation
const validateDepartmentInput = require("../validation/department");
//Load Department model and department domain
const DepartmentModel = require("../models/DepartmentModel");
const Department = require("../domain/department");

const addDepartment = async payload => {
  const { errors, isValid } = validateDepartmentInput(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  let department = await DepartmentModel.getDepartmentByName(payload.name);

  if (department) {
    errors.name = "Department name already exists";
    throw common.helper.wrapError(errors, 400);
  }

  const newDepartment = new Department(null, payload.name, payload.desc);

  var result = await DepartmentModel.save(newDepartment);
  newDepartment.id = result.id;

  return newDepartment;
};

const getDepartments = async () => {
  const departments = await DepartmentModel.getDepartmentList();

  if (departments.length == 0) {
    errors.name = "There are no department found!";
    throw common.helper.wrapError(errors, 404);
  }

  return departments;
};

const deleteDepartment = async id => {
  const department = await DepartmentModel.getDepartmentById(id);
  if (!department) {
    errors.name = "Department can not found";
    throw common.helper.wrapError(errors, 404);
  }
  //TODO: we should check that this department is assigned to any employee
  await DepartmentModel.deleteById(id);

  return id;
};

module.exports = {
  addDepartment,
  getDepartments,
  deleteDepartment
};

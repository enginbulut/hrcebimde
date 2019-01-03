require("../dataaccess/mongo");
const Department = require("../domain/department");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

//Create Schema
const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String
  }
});

const DepartmentModel = mongoose.model(
  "departments",
  DepartmentSchema,
  "departments"
);

const convertToModel = (department = new Department()) => {
  let model = new DepartmentModel();
  model.name = department.name;
  model.desc = department.desc;
  model._doc._id = mongoose.Types.ObjectId(department.id);

  return model;
};

const departmentSelector = department => {
  return {
    _id: department.id
  };
};

const getDepartmentList = async () => {
  const departmentModels = await DepartmentModel.find({});

  return departmentModels.length > 0
    ? departmentModels.map(
        departmentModel =>
          new Department(
            departmentModel.id,
            departmentModel.name,
            departmentModel.desc
          )
      )
    : [];
};

const deleteById = async id => {
  await DepartmentModel.findByIdAndDelete(id);
};

const getDepartmentById = async id => {
  const departmentModel = await DepartmentModel.findById(id);
  return departmentModel
    ? new Department(
        departmentModel.id,
        departmentModel.name,
        departmentModel.desc
      )
    : undefined;
};

const getDepartmentByName = async name => {
  const departmentModel = await DepartmentModel.findOne({ name });
  return departmentModel
    ? new Department(
        departmentModel.id,
        departmentModel.name,
        departmentModel.desc
      )
    : undefined;
};

module.exports = {
  save: save(
    DepartmentModel,
    convertToModels(convertToModel),
    departmentSelector
  ),
  getDepartmentList,
  deleteById,
  getDepartmentById,
  getDepartmentByName
};

require("../dataaccess/mongo");
const mongoose = require("mongoose");
const Employee = require("../domain/employee")
const { save, convertToModels } = require("../dataaccess/mongohelper");
const isEmpty = require("../validation/is-empty");

const Schema = mongoose.Schema;

//Create Schema
schemaOptions = {
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branches",
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "departments",
    required: true
  },
  workScheduleType: {
    type: String,
    required: true
  },
  phoneNumber: String,
  manager: {
    type: Schema.Types.ObjectId,
    ref: "employees"
  },
  title: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  grade: String,
  citizenNo: String,
  maritalStats: String,
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true
  },
  militaryObligation: Boolean,
  homeAddress: String,
  kidCount: Number,
};
const EmployeeSchema = new Schema(schemaOptions);

const EmployeeModel = mongoose.model("employees", EmployeeSchema, "employees");
/**
 * 
 * @param {typeof employeeDomain} user 
 */
const convertToModel = (user) => {
  let model = new EmployeeModel();
  model.user = user.user;
  model.startDate = user.startDate;
  model.branch = user.branch;
  model.department = user.department;
  model.workScheduleType = user.workScheduleType;
  model.title = user.title;
  model.gender = user.gender;
  model._doc._id = mongoose.Types.ObjectId(user.id);
  return model;
};

const selector = item => {
  return {
    _id: item.id
  }
}

const findById = async id => {
  const item = await EmployeeModel.findById(new mongoose.mongo.ObjectID(id))
    .populate("user", ["name", "email"])
    .populate("branch", ["name"])
    .populate("department", ["name"])
    .populate({
      path: "manager",
      select: ["title"],
      populate: {
        path: "user",
        select: ["name", "email"]
      }
    });

  return item ? Employee.converter(item) : undefined;
};

const deletebyId = async id => {
  await EmployeeModel.findByIdAndDelete(new mongoose.mongo.ObjectID(id));
};

const getAll = async () => {
  const items = await EmployeeModel.find()
    .populate("user", ["name", "email"])
    .populate("branch", ["name"])
    .populate("department", ["name"])
    .populate({
      path: "manager",
      select: ["title"],
      populate: {
        path: "user",
        select: ["name", "email"]
      }
    });
  return items ? Employee.converter(items) : [];
};

const setUser = async (id, userId) => {
  const item = await EmployeeModel.findById(new mongoose.mongo.ObjectID(id));
  item.user = new mongoose.mongo.ObjectID(userId);
  await item.save();
  return item;
};

const validateSchema = (data) => {
  let isValid = true;
  let errors = {};
  for (prop in schemaOptions) {
    if (schemaOptions[prop].required && !data[prop]) {
      isValid = false;
      errors[prop] = `${prop} field is required`;
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validateSetUser = (id, userId) => {
  let isValid = true;
  let errors = {};
  if (!id) {
    isValid = false;
    errors.id = `${id} field is required`;
  }
  if (!userId) {
    isValid = false;
    errors.userId = `${userId} field is required`;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = {
  validate: {
    schema: validateSchema,
    setUser: validateSetUser
  },
  save: save(EmployeeModel, convertToModels(convertToModel), selector),
  findById,
  getAll,
  deletebyId,
  setUser
};

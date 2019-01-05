require("../dataaccess/mongo");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");


const Schema = mongoose.Schema;

//Create Schema
const EmployeeSchema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branch",
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "department",
    required: true
  },
  workScheduleType: {
    type: String,
    required: true
  },
  phoneNumber: String,
  manager: {
    type: Schema.Types.ObjectId,
    ref: "employee"
  },
  title: {
    type: String,
    required: true
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
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema, "employees");
/**
 * 
 * @param {import("../domain/employee")} user 
 */
const convertToModel = (user) => {
  let model = new EmployeeModel();
  model.startDate=user.startDate;
  model.branch=user.branch;
  model.department=user.department;
  model.workScheduleType=user.workScheduleType;
  model.title=user.title;
  model.gender=user.gender;
  model._doc._id = mongoose.Types.ObjectId(user.id);
  
  return model;
};

const selector = item => {
  return {
      _id: item.id
  }
}


// const getUserByEmail = async email => {
//   const userModel = await UserModel.findOne({ email }).populate("role", [
//     "name",
//     "permissioncode"
//   ]);
//   return userModel
//     ? new User(
//       userModel.name,
//       userModel.email,
//       userModel.password,
//       userModel.avatar,
//       userModel.date,
//       userModel.id,
//       userModel.role
//     )
//     : undefined;
// };

// const findById = async id => {
//   const userModel = await UserModel.findById(id).populate("role", [
//     "name",
//     "permissioncode"
//   ]);
//   return userModel
//     ? new User(
//       userModel.name,
//       userModel.email,
//       userModel.password,
//       userModel.avatar,
//       userModel.date,
//       userModel.id,
//       userModel.role
//     )
//     : undefined;
// };

module.exports = {
  save: save(EmployeeModel, convertToModels(convertToModel), selector),
  findById
};

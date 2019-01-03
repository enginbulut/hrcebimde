require("../dataaccess/mongo");
const User = require("../domain/user");
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
  kidCount: Number,
  homeAddress: String
});

// const UserModel = mongoose.model("users", UserSchema, "users");

// const convertToModel = (user = new User()) => {
//   let model = new UserModel();
//   model.name = user.name;
//   model.email = user.email;
//   model.password = user.password;
//   model.date = user.date;
//   model.avatar = user.avatar;
//   model._doc._id = mongoose.Types.ObjectId(user.id);
//   model.role = user.role.id;

//   return model;
// };

// const userSelector = user => {
//   return {
//     _id: user.id
//   };
// };

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
  save: save(UserModel, convertToModels(convertToModel), userSelector),
  getUserByEmail,
  findById
};

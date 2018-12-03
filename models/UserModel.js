require("../dataaccess/mongo");
const User = require("../domain/user");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: "roles"
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model("users", UserSchema, "users");

const convertToModel = (user = new User()) => {
  let model = new UserModel();
  model.name = user.name;
  model.email = user.email;
  model.password = user.password;
  model.date = user.date;
  model.avatar = user.avatar;
  model._doc._id = mongoose.Types.ObjectId(user.id);
  model.role = user.role.id;

  return model;
};

const userSelector = user => {
  return {
    _id: user.id
  };
};

const getUserByEmail = async email => {
  const userModel = await UserModel.findOne({ email }).populate("role", [
    "name",
    "permissioncode"
  ]);
  return userModel
    ? new User(
        userModel.name,
        userModel.email,
        userModel.password,
        userModel.avatar,
        userModel.date,
        userModel.id,
        userModel.role
      )
    : undefined;
};

const findById = async id => {
  const userModel = await UserModel.findById(id).populate("role", [
    "name",
    "permissioncode"
  ]);
  return userModel
    ? new User(
        userModel.name,
        userModel.email,
        userModel.password,
        userModel.avatar,
        userModel.date,
        userModel.id,
        userModel.role
      )
    : undefined;
};

module.exports = {
  save: save(UserModel, convertToModels(convertToModel), userSelector),
  getUserByEmail,
  findById
};

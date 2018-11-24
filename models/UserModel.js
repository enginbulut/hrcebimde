require("../dataaccess/mongo");
const User = require("../domain/user");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
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
  // Mongo auto generated id is not used and fails the updates.
  delete model._doc._id;
  return model;
};

const userSelector = user => {
  return {
    email: user.email
  };
};

const getUserByEmail = async email => {
  const userModel = await UserModel.findOne({ email });
  return userModel
    ? new User(
        userModel.name,
        userModel.email,
        userModel.password,
        userModel.avatar,
        userModel.date
      )
    : undefined;
};

const findById = async id => {
  const user = await UserModel.findById(id);
  return user;
};

module.exports = {
  UserModel,
  convertToModel: convertToModels(convertToModel),
  save: save(UserModel, convertToModels(convertToModel), userSelector),
  getUserByEmail,
  findById
};

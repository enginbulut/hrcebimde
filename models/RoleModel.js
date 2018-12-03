require("../dataaccess/mongo");
const Role = require("../domain/role");
const mongoose = require("mongoose");
const { save, convertToModels } = require("../dataaccess/mongohelper");

const Schema = mongoose.Schema;

//Create Schema
const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  permissioncode: {
    type: Number,
    required: true,
    default: 0
  }
});

//0 - guest user
//1 - employee
//2 - manager
//3 - hr
//4 - admin
//5 - superadmin
const RoleModel = mongoose.model("roles", RoleSchema, "roles");

const convertToModel = (role = new Role()) => {
  let model = new RoleModel();
  model.name = role.name;
  model.permissioncode = role.permissioncode;
  model._doc._id = mongoose.Types.ObjectId(role.id);

  return model;
};

const roleSelector = role => {
  return {
    _id: role.id
  };
};

const getRoleByName = async name => {
  const roleModel = await RoleModel.findOne({ name });
  return roleModel
    ? new Role(roleModel.name, roleModel.permissioncode, roleModel.id)
    : undefined;
};

const getRoleByPermissionCode = async permissioncode => {
  const roleModel = await RoleModel.findOne({ permissioncode });
  return roleModel
    ? new Role(roleModel.name, roleModel.permissioncode, roleModel.id)
    : undefined;
};

const getGuestRole = async () => {
  const roleModel = await RoleModel.findOne({ permissioncode: 0 });
  return roleModel
    ? new Role(roleModel.name, roleModel.permissioncode, roleModel.id)
    : undefined;
};

const getRoleById = async id => {
  const roleModel = await RoleModel.findById(id);
  return roleModel
    ? new Role(roleModel.name, roleModel.permissioncode, roleModel.id)
    : undefined;
};

const getRoleList = async name => {
  const roleModels = await RoleModel.find({});

  return roleModels.length > 0
    ? roleModels.map(
        roleModel =>
          new Role(roleModel.name, roleModel.permissioncode, roleModel.id)
      )
    : [];
};

const deleteById = async id => {
  await RoleModel.findByIdAndDelete(id);
};

module.exports = {
  save: save(RoleModel, convertToModels(convertToModel), roleSelector),
  getRoleByName,
  getRoleList,
  getRoleById,
  deleteById,
  getRoleByPermissionCode,
  getGuestRole
};

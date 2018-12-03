const utils = require("../service/utils");
const common = require("../service/common");

//Load input validation
const validateAddRoleInput = require("../validation/role");

//Load Role model and role domain
const RoleModel = require("../models/RoleModel");
const Role = require("../domain/role");

const addRole = async payload => {
  const { errors, isValid } = validateAddRoleInput(payload);
  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  let role = await RoleModel.getRoleByName(payload.name);

  if (role) {
    errors.name = "Role name already exists";
    throw common.helper.wrapError(errors, 400);
  }

  role = await RoleModel.getRoleByPermissionCode(payload.permissioncode);
  if (role) {
    errors.name = "This permission code already exists";
    throw common.helper.wrapError(errors, 400);
  }

  const newRole = new Role(payload.name, payload.permissioncode);

  var result = await RoleModel.save(newRole);
  newRole.id = result.id;

  return newRole;
};

const getRoles = async () => {
  const roles = await RoleModel.getRoleList();

  if (roles.length == 0) {
    errors.name = "There are no roles found!";
    throw common.helper.wrapError(errors, 404);
  }

  return roles;
};

const deleteRole = async id => {
  const role = await RoleModel.getRoleById(id);
  if (!role) {
    errors.name = "Role can not found";
    throw common.helper.wrapError(errors, 404);
  }

  await RoleModel.deleteById(id);

  return id;
};

module.exports = {
  addRole,
  getRoles,
  deleteRole
};

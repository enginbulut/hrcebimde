const utils = require("../service/utils");
const common = require("../service/common");
//Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//Load User model and user domain
const UserModel = require("../models/UserModel");
const User = require("../domain/user");
const RoleModel = require("../models/RoleModel");

const registerUser = async payload => {
  const { errors, isValid } = validateRegisterInput(payload);

  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  const user = await UserModel.getUserByEmail(payload.email);

  if (user) {
    errors.email = "Email already exists";
    throw common.helper.wrapError(errors, 400);
  }
  const avatar = utils.getGravatar(payload.email);

  var hashedPassword = utils.getHash(payload.password);

  const defaultRole = await RoleModel.getGuestRole();

  let newUser = new User(
    payload.name,
    payload.email,
    hashedPassword,
    avatar,
    undefined,
    undefined,
    defaultRole
  );

  const result = await UserModel.save(newUser);

  newUser.id = result.id;
  delete newUser.password;
  delete newUser.date;

  return newUser;
};

const loginUser = async payload => {
  const { errors, isValid } = validateLoginInput(payload);

  if (!isValid) {
    throw common.helper.wrapError(errors, 400);
  }

  const user = await UserModel.getUserByEmail(payload.email);
  if (!user) {
    errors.email = "User email not found";
    throw common.helper.wrapError(errors, 404);
  }

  const isMatched = utils.compareHash(payload.password, user.password);

  if (isMatched) {
    const jwtPayload = {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      id: user.id,
      permissioncode: user.role.permissioncode,
      roleName: user.role.name
    }; //create JWT payload
    return utils.signPayload(jwtPayload);
  } else {
    errors.password = "Password incorrect";
    throw common.helper.wrapError(errors, 400);
  }
};

const changePassword = async (id, payload) => {
  const user = await UserModel.findById(id);
  if (!user) {
    errors.id = "User cannot found!";
    throw common.helper.wrapError(errors, 404);
  }

  var hashedNewPassword = utils.getHash(payload.newPassword);
  user.password = hashedNewPassword;
  await UserModel.save(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    rolename: user.role.name,
    permissioncode: user.role.permissioncode
  };
};

const updateRole = async (id, payload) => {
  let user = await UserModel.findById(id);
  if (!user) {
    errors.id = "User cannot found!";
    throw common.helper.wrapError(errors, 404);
  }

  const role = await RoleModel.getRoleById(payload.id);
  if (!role) {
    errors.id = "Role cannot found!";
    throw common.helper.wrapError(errors, 404);
  }

  user.role = role;

  const updatedUser = await UserModel.save(user);

  delete user.password;
  delete user.date;

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  updateRole
};

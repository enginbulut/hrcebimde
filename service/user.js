const utils = require("../service/utils");
const common = require("../service/common");
//Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

//Load User model and user domain
const UserModel = require("../models/UserModel");
const User = require("../domain/user");

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

  const newUser = new User(payload.name, payload.email, hashedPassword, avatar);

  await UserModel.save(newUser);

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
      avatar: user.avatar
    }; //create JWT payload
    return utils.signPayload(jwtPayload);
  } else {
    errors.password = "Password incorrect";
    throw common.helper.wrapError(errors, 400);
  }
};

module.exports = {
  registerUser,
  loginUser
};
